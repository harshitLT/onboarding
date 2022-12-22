import { Request } from 'express';
import { UserDocument } from '../../user/schemas/user.schema';

interface RequestWithUser extends Request {
  user: UserDocument;
}

export default RequestWithUser;
