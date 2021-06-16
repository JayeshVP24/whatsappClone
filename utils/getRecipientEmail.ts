const getRecipientEmail = (users: string[], userLoggedIn: any) => (
    users?.filter(userToFilter => userToFilter !== userLoggedIn?.email)[0]
)

export default getRecipientEmail