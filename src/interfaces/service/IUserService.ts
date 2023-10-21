export default interface IUserService {
    updateUsername(userId: string, newUsername: string): Promise<void>;
}