import bcrypt from 'bcrypt';
import User from './models/Users';

const mockUsers = [
    {
        username: 'peter',
        password: 'password123',
        org: 1
    },
    {
        username: 'anders',
        password: 'password321',
        org: 2
    },
    {
        username: 'lotte',
        password: '321drowssap',
        org: 1
    }
];

export async function createMockUsers(): Promise<void> {
    for (const user of mockUsers) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        try {
            await User.create({
                username: user.username,
                password: hashedPassword,
                organization: user.org
            });
            console.log(`User ${user.username} created successfully.`);
        } catch (error) {
            console.error(`Error creating user ${user.username}:`, error);
        }
    }
}
