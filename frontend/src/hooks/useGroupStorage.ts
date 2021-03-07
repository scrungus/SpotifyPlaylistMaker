import React, { useState, useEffect, useRef } from 'react';
import { Plugins } from '@capacitor/core';
import { Icon } from 'ionicons/dist/types/components/icon/icon';

const { Storage } = Plugins;

// var groupName: string;
// var groupMembers: [User];

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

async function newGroupInStorage(groupName: string) {
    const prevGroups = await get("groupNames");
    const toSet = prevGroups === null ? [groupName] : [groupName, ...prevGroups].reverse()
    await set("groupNames", toSet);
}

async function setGroup(groupName: string, JSONGroup: JSON) {
    await Storage.set({
        key: groupName,
        value: JSON.stringify(JSONGroup)
    });
    console.log(JSONGroup);
}

async function getGroup(groupName: string) {
    const ret = await Storage.get({ key: groupName });
    return JSON.parse(ret.value!)
}

export function displayGroup(groupName: string) {
    return groupName === "" ? "" : newGroupInStorage(groupName);
}

export function useGroupStorage() {
    const [groupName, setGroupName] = useState("");
    const [members, setMembers] = useState<User[]>([]);
  
    useEffect(() => {
        const loadSaved = async () => {
            const groupString = await getGroup("Group 24");
            const groupInStorage = (groupString ? JSON.parse(groupString) : []) as User[];
            setMembers(groupInStorage);
        }
        loadSaved();
    }, [])

    const createGroup = (name: string) => {
        newGroupInStorage(name);
    }
  
    const addMember = () => {
    //   const newMember = membersRef.current!.value;
    //   membersRef.current!.value = "";
    //   if (newMember === "") {
    //     alert("Enter a username");
        return;
    //   }
  
    //   var newMembers = members;
    //   newMembers.push(newMember);
    //   setMembers(newMembers);
    }

    const removeMember = () => {
        return;
    }

    return {
        createGroup,
        addMember,
        removeMember
    }
}

export function addMember() {
    return;
}

export function useGroupsStorage(groupName: string) {
    
    // var list: HTMLElement | null
    // list = document.getElementById(listId);
    // if (list) {
    //     list.appendChild(Node("hi"))
    // }

    


    // return undefined;
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