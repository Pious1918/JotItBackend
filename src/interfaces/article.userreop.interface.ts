import { IUser } from "./iuser.interface";

export interface IUserRepository {
    getAllarticle(): Promise<any[]>; // Return type is an array, but you can adjust it if necessary.
    findbyEmail(email: string): Promise<any | null>; // Adjust the return type as per your actual data model.
    createUser(userData: Partial<IUser>): Promise<IUser | null>;
    getCurrentUser(userId: string): Promise<IUser | null>;
    updateProfilePic(userId: string, updateData: { profileImage: string }): Promise<any>;
    updateName(userId: string, updateData: { name: string }): Promise<any>;
}