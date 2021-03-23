import { Component } from 'react';
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
import { sendRequest } from '../hooks/requestManager';

class GroupCreator extends Component {

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
        return index !== num;})
    });
  }

  // TODO: Replace these with the proper requests and remove the alerts.
  saveGroup = () => {
    const gName = this.state.group;
    const mems = this.state.members;
    if (mems.length === 0) {
      alert(gName+" has no members, so it can't be created. Going back to Groups page.");
      return;
    }

    alert("Create \""+gName+"\".");
    const bodyGroup = { name: gName, creatorID: mems[0] };
    sendRequest("POST", 8002, "addGroup", bodyGroup, "group");

    mems.forEach(function (mem) {
      alert("Add \""+mem+"\" to "+gName+".");
      const bodyMem = { groupCode: gName, userID: mem };
      sendRequest("POST", 8002, "addGroupMember", bodyMem, "group");
    });

    alert("Going back to Groups page.");
  }

  render() {
    return (<>
      <IonFab vertical="top" horizontal="end" slot="fixed" edge>
        <IonFabButton onClick={() => this.saveGroup()} href="/main_tabs">
          <IonIcon icon={this.state.members.length === 0 ? arrowBack : checkmark}/>
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
          {this.state.members.map((member, index) => (
            <IonItem key={member}>
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
