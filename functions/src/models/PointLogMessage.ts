import { MessageType } from './MessageType'
import { UserPermissionLevel } from './UserPermissionLevel'

export class PointLogMessage {
    static CREATION_DATE = "CreationDate"
    static MESSAGE = "Message"
    static MESSAGE_TYPE = "MessageType"
    static SENDER_FIRST_NAME = "SenderFirstName"
    static SENDER_LAST_NAME = "SenderLastName"
    static SENDER_PERMISSION_LEVEL = "SenderPermissionLevel"

    creationDate: Date
    message: string
    messageType: MessageType
    senderFirstName: string
    senderLastName: string
    senderPermissionLevel: UserPermissionLevel

    constructor(creationDate: Date, message: string, messageType: MessageType, 
        senderFirstName: string, senderLastName: string, senderPermissionLevel: UserPermissionLevel){
            this.creationDate = creationDate
            this.message = message
            this.messageType = messageType
            this.senderFirstName = senderFirstName
            this.senderLastName = senderLastName
            this.senderPermissionLevel = senderPermissionLevel
    }

    toJson(){
        const data = {}
        data[PointLogMessage.CREATION_DATE] = this.creationDate
        data[PointLogMessage.MESSAGE] = this.message
        data[PointLogMessage.MESSAGE_TYPE] = this.messageType
        data[PointLogMessage.SENDER_FIRST_NAME] = this.senderFirstName
        data[PointLogMessage.SENDER_LAST_NAME] = this.senderLastName
        data[PointLogMessage.SENDER_PERMISSION_LEVEL] = this.senderPermissionLevel
        return data
    }

    static getPreaprovedMessage(): PointLogMessage {
        return new PointLogMessage(new Date(), "Preapproved", MessageType.APPROVE, "PurdueHCR", "", UserPermissionLevel.RHP)
    }

    static fromQuerySnapshot(snapshot: FirebaseFirestore.QuerySnapshot): PointLogMessage[] {
        const messages: PointLogMessage[] = []
        for( const document of snapshot.docs){
            messages.push(this.fromData(document.data()))
        }
        return messages;
    }

    private static fromData(document: FirebaseFirestore.DocumentData): PointLogMessage {
        let creationDate: Date
        let message: string
        let messageType: MessageType
        let senderFirstName: string
        let senderLastName: string
        let senderPermissionLevel: UserPermissionLevel

        creationDate = document[PointLogMessage.CREATION_DATE]
        message = document[PointLogMessage.MESSAGE]
        messageType = document[PointLogMessage.MESSAGE_TYPE]
        senderFirstName = document[PointLogMessage.SENDER_FIRST_NAME]
        senderLastName = document[PointLogMessage.SENDER_LAST_NAME]
        senderPermissionLevel = document[PointLogMessage.SENDER_PERMISSION_LEVEL]

        return new PointLogMessage(creationDate, message, messageType, senderFirstName, senderLastName, senderPermissionLevel)
    }

}