from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Tutorial
from .serializers import TutorialSerializer


class HelloWorldView(APIView):
    def get(self, request):
        return Response({"message": "Hello from Django!"})

class TutorialListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tutorials = Tutorial.objects.filter(user=request.user)
        serializer = TutorialSerializer(tutorials, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Temp post for testing, TODO change this
        data = request.data.copy()
        serializer = TutorialSerializer(data=data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        if request.data['title'] is not None:
            update_data['title'] = request.data['title']
        elif request.data['body'] is not None:
            update_data['body'] = request.data['body']
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
    
class TutorialValidateView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data

        # Temp validation, TODO change this
        if len(data['title']) < 5:
            return Response({'result': 'false', 'errors': {'title': 'Title must be at least 5 characters'}}, status=status.HTTP_400_BAD_REQUEST)

        if data['body'] == '':
            return Response({'result': 'false', 'errors': {'body': 'Body must contain a non-empty list'}}, status=status.HTTP_400_BAD_REQUEST)


        return Response({'result': 'true'}, status=status.HTTP_200_OK)