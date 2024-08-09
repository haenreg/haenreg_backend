import bcrypt from 'bcrypt';
import User from './models/Users';
import Organization from './models/Organizations';

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
    const orgCount = await Organization.count();
    if (orgCount === 0) {
        await createMockOrgs();
    }
    for (const user of mockUsers) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        try {
            await User.create({
                username: user.username,
                password: hashedPassword,
                organizationId: user.org
            });
            console.log(`User ${user.username} created successfully.`);
        } catch (error) {
            console.error(`Error creating user ${user.username}:`, error);
        }
    }
}

const createMockOrgs = async () => {
    try {
        await Organization.create( {
            name: 'Østerbyskolen'
        });
        await Organization.create( {
            name: 'Grønvangskolen'
        })
    } catch (error) {
        console.error('Error creating organizations');
    }
};
