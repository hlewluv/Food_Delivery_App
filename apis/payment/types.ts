export interface invoice{
    user_id: string,
    amount: number
}

export interface invoiceReponse{
    returncode: number,
    returnmessage?: string,
    zptranstoken: string,
    orderurl: string,
}