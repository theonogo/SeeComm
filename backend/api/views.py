from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Tutorial
from .serializers import TutorialSerializer
from google import genai
from google.genai import types
import json
from pydantic import BaseModel, ValidationError
from typing import List, Optional
from datetime import datetime
import re
import os

class ClipTimestamps(BaseModel):
    start: int
    end: int

class Step(BaseModel):
    title: str
    body: str
    clip: Optional[ClipTimestamps]

class TutorialArticle(BaseModel):
    title: str
    steps: List[Step]

class HelloWorldView(APIView):
    def get(self, request):
        return Response({"message": "Hello from Django!"})

class TutorialListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tutorials = Tutorial.objects.filter(user=request.user)
        serializer = TutorialSerializer(tutorials, many=True)
        return Response(serializer.data)
    

    def processPhrases(self, phrases):
        ### Process phrases to merge them together
        processed_phrases = []
        curr_phrase = None

        for phrase in phrases:
            if curr_phrase is None:
                # First phrase
                curr_phrase = phrase.copy()
            elif curr_phrase['speaker'] == phrase['speaker']:
                # Merge phrases if they are from the same speaker
                curr_phrase['duration_in_ticks'] += phrase['duration_in_ticks']
                curr_phrase['display'] += ' ' + phrase['display']
            else:
                 # Speaker changed, save curr phrase and start new one
                processed_phrases.append(curr_phrase)
                curr_phrase = phrase.copy()

        # add last phrase
        processed_phrases.append(curr_phrase)

        ### Clarify phrase start/end times
        for phrase in processed_phrases:
            phrase['start_seconds'] = int(phrase['offset_milliseconds']) / 1000
            phrase['end_seconds'] = phrase['start_seconds'] + int(phrase['duration_in_ticks']) / 10000000

        ### Remove unnecessary fields
        to_remove = ['offset_milliseconds', 'duration_in_ticks', 'confidence', 'locale']
        for phrase in processed_phrases:
            for field in to_remove:
                del phrase[field]
        
        return processed_phrases
    

    def generateTutorial(self, phrases):
        client = genai.Client(api_key=os.environ.get('GENAI_API_KEY'))

        model_name=os.environ.get('GEMINI_MODEL')

        system_instruction = """
        This is a transcript from a support call. 
        Extract relevant steps from the transcript and generate a clear step-by-step tutorial summarizing how the issue was resolved or handled. 
        Include steps only when meaningful (avoid trivial dialogue). Give clear step titles and detailed explanations.
        If useful for a step, include a start and end second where a video snippet would help. Don't do this for every single step, only if helpful. 
        (don't include clip times in the step body, just put it in clip json).
        Return the tutorial in JSON format
        """

        generation_config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json",
            response_schema=TutorialArticle,
        )

        response = client.models.generate_content(
            model=model_name,
            contents=json.dumps(phrases, indent=2),
            config=generation_config
        )

        return response

    def post(self, request):
        uploaded_file = request.FILES.get('file')
        video_url = request.POST.get('video_url').strip()

        # verify file and video URL
        validity = TutorialValidateView.verifyUpload(TutorialValidateView, file=uploaded_file, video_url=video_url)
        if not validity['result']:
            return Response({'detail': validity['error']}, status=status.HTTP_400_BAD_REQUEST)
        
        json_data = validity['file_data']

        processed_phrases = self.processPhrases(json_data['phrases'])

        # Generate the tutorial using the LLM
        try:
            response = self.generateTutorial(processed_phrases)
            if response.prompt_feedback and response.prompt_feedback.block_reason:
                return Response({'detail': 'Error generating tutorial: ' + response.prompt_feedback.block_reason}, status=status.HTTP_400_BAD_REQUEST)
            if response.text is None:
                return Response({'detail': 'Error generating tutorial'}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            print(e.errors())
            return Response({'detail': 'Error generating tutorial: ' + str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            response_content = json.loads(response.text)
        except json.JSONDecodeError as e:
            return Response({'detail': 'Error parsing tutorial response: ' + str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new tutorial object and save to db
        tutorial = Tutorial.objects.create(
            user=request.user,
            transcript= json_data,
            video_url=video_url,
            title=response_content["title"],
            body=response_content["steps"],
        )

        

        serializer = TutorialSerializer(tutorial)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TutorialDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Tutorial.objects.get(pk=pk, user=user)
        except Tutorial.DoesNotExist:
            return None

    def get(self, request, pk):
        tutorial = self.get_object(pk, request.user)
        if not tutorial:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = TutorialSerializer(tutorial)
        return Response(serializer.data)

    def patch(self, request, pk):
        tutorial = self.get_object(pk, request.user)
        if not tutorial:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

        update_data = {}
        if request.data.get('title') is not None:
            update_data['title'] = request.data['title']
        elif request.data.get('body') is not None:
            update_data['body'] = json.loads(request.data['body'])
        else:
            return Response({'detail': 'You must specify the title or body to update'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = TutorialSerializer(tutorial, data=update_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        tutorial = self.get_object(pk, request.user)
        if not tutorial:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        tutorial.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class Phrase(BaseModel):
    offset_milliseconds: int
    duration_in_ticks: float
    display: str
    speaker: int
    locale: str
    confidence: float

class Transcript(BaseModel):
    timestamp: datetime
    duration_in_ticks: int
    phrases: List[Phrase]

class TutorialValidateView(APIView):
    permission_classes = [IsAuthenticated]

    def verifyUpload(self, file, video_url):
        # Check the file and video url have been sent
        if not file:
            return {'result': False, 'error': 'Missing file'}
        if not video_url:
            return {'result': False, 'error': 'Missing video url'}

        try:
            # Check the json file format
            file_data = file.read().decode('utf-8')
            json_data = json.loads(file_data)

            # Validate the json file content
            parsed = Transcript.model_validate(json_data)
            if parsed.phrases is None or len(parsed.phrases) == 0:
                return {'result': False, 'error': 'No phrases found in the JSON file'}
        except Exception as e:
            print(e)
            return {'result': False, 'error': 'Invalid JSON file'}
        
        # Check the video URL format regex
        pattern = re.compile( r'^https:\/\/drive\.google\.com\/file\/d\/\S+\/view\?usp=drive_link$')
        if not pattern.match(video_url):
            return {'result': False, 'error': 'Invalid video URL format'}

        return {'result': True, 'error': '', 'file_data': json_data}

    def post(self, request):
        uploaded_file = request.FILES.get('file')
        video_url = request.POST.get('video_url').strip()

        validity = self.verifyUpload(uploaded_file, video_url)
        if not validity['result']:
            return Response({'detail': validity['error']}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'result': 'true'}, status=status.HTTP_200_OK)