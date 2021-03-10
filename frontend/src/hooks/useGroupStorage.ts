import { Plugins } from '@capacitor/core';
import { Icon } from 'ionicons/dist/types/components/icon/icon';

const { Storage } = Plugins;

export async function set(key: string, value: any): Promise<void> {
    await Storage.set({
        key: key,
        value: JSON.stringify(value)
    });
}
  
export async function get(key: string): Promise<any> {
    const item = await Storage.get({ key: key });
    return JSON.parse(item.value!);
}
  
export async function remove(key: string): Promise<void> {
    await Storage.remove({ key: key });
}

export function useGroupStorage() {
    // useEffect(() => {
    //     const loadSaved = async () => {
    //         const groupString = await get("Group 24");
    //         const groupInStorage = (groupString ? JSON.parse(groupString) : []);
    //         setMembers(groupInStorage);
    //     }
    //     loadSaved();
    // }, [])

    const saveGroup = async (name: string, members: string[]) => {
        const prevGroups = await get("groupNames");
        const toSet = prevGroups === null ? [name] : [...prevGroups, name];
        set("groupNames", toSet);
        set(name, members);
    }

    return {
        saveGroup
    };
}

export interface Group {
    groupName: string;
    icon: Icon;
    members: User[];
}

export interface User {
    account: string;
    username: string;
    icon: Icon;
}