
export type Tutorial = {
    id : string,
    user : number,
    transcript: string,
    video_url: string,
    created_at: Date,
    title: string,
    body: Step[]
}

export type Step = {
    title: string,
    body: string,
    clip: {start: number, end: number} | null
}