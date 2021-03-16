import React, { Component } from 'react';
import {
  IonButton,
  IonCard,
  IonFab,
  IonFabButton,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonThumbnail,
  IonTitle,
} from '@ionic/react';
import { arrowBack, checkmark, people } from 'ionicons/icons';
//import { useGroupStorage } from '../hooks/useGroupStorage';

class GroupCreator extends Component {
  // Testing purposes, will be redundant once data is pulled from db
  //const { saveGroup } = useGroupStorage();

  state = {
    group: "New Group",
    members: [],
  }

  nameGroup = () => {
    const name = document.getElementById("namegroup").value;
    if (name === "") {
      alert("Enter a name.");
      return;
    }
    this.setState({
      group: name,
    });
    document.getElementById("namegroup").value = "";
  }

  addMember = () => {
    const name = document.getElementById("addmem").value;
    if (name === "") {
      alert("Enter a name.");
      return;
    }
    this.setState({
      members: [...this.state.members, name],
    });
    document.getElementById("addmem").value = "";
  }

  subMember = (num) => {
    this.setState({
      members: this.state.members.filter(function(value, index, arr){
        return index != num;})
    });
  }

  back = () => {
    if (this.state.members.length==0) {
      alert("Go back.");
    } else {
      alert("Save the group and go back.");
    }
  }

  render() {
    return (<>
      <IonFab vertical="top" horizontal="end" slot="fixed" edge>
        <IonFabButton onClick={() => this.back()} href="./groups">
          <IonIcon icon={this.state.members.length==0?arrowBack:checkmark}/>
        </IonFabButton>
      </IonFab>
      <IonCard>
        <IonItem>
          <IonThumbnail slot="start">
            <IonImg src={people}></IonImg>
          </IonThumbnail>
          <IonTitle>{this.state.group}</IonTitle>
        </IonItem>
        <IonItem>
          <IonInput id="namegroup" type="text"placeholder="Name"></IonInput>
          <IonButton onClick={() => this.nameGroup()}>Rename group</IonButton>
        </IonItem>
      </IonCard>
      <IonCard>
        <IonItem>
          <IonTitle>Members ({this.state.members.length}):</IonTitle>
        </IonItem>
        <IonList>
          {this.state.members.map((member: string, index: number) => (
            <IonItem>
              <IonLabel>{member}</IonLabel>
              <IonButton color="danger" onClick={() => this.subMember(index)}>Remove</IonButton>
            </IonItem>
          ))}
          <IonItem>
            <IonInput id="addmem" type="text" placeholder="Name"></IonInput>
            <IonButton onClick={() => this.addMember()}>Add member</IonButton>
          </IonItem>
        </IonList>
      </IonCard>
    </>);
  }
}

export default GroupCreator;
