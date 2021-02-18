export default interface Applicant {
    name: string,
    text: string,
    gender: string,
    when: number,
    id: string,
    ratings: {
        "till": number,
        "maike": number,
        "lea": number
    }
}