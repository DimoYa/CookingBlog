import Base from "./base-model";

interface UserModel extends Base {
    fullname: string;
    username: string;
    email?: string;
    password?: string;
    phoneCode?: string;
    phoneNumber?: string;
    photo?: string;
    isAdmin?: boolean;
    disabled?: boolean;
}
export default UserModel;