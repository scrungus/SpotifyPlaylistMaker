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
  IonText,
  IonThumbnail,
  IonTitle,
} from '@ionic/react';
import { arrowBack, checkmark, people } from 'ionicons/icons';
import { sendRequestAsync } from '../hooks/requestManager';
import './GroupCreator.css';

class GroupCreator extends Component {

  state = {
    name: "",
  }

  nameGroup = () => {
    const name = document.getElementById("namegroup").value;
    if (name === "") {
      alert("Enter a name.");
      return;
    }
    this.setState({
      name: name,
    });
    document.getElementById("namegroup").value = "";
  }

  saveGroup = () => {
    const name = this.state.name;
    if (name=="") {
      return;
    }
    const creatorID = JSON.parse(document.cookie.split('; ')[0].slice(5)).spotify_id;
    const params = { creatorID: creatorID, name: name };
    console.log(params);
    let http = sendRequestAsync("POST", 8002, "addGroup", params, "addgroup");
    http.onreadystatechange = e =>{
      if(http.readyState != 4){
        return;
      }
      window.location.href = "/main_tabs/groups"
    }
  }
  
  render() {
    return (<>
      <IonFab vertical="top" horizontal="end" slot="fixed" edge>
        <IonFabButton onClick={() => this.saveGroup()} href="/main_tabs/groups">
          <IonIcon icon={this.state.name==""?arrowBack:checkmark}/>
        </IonFabButton>
      </IonFab>
      <IonCard>
        <IonItem>
          <IonThumbnail slot="start">
            <IonImg src={people}></IonImg>
          </IonThumbnail>
          <IonTitle>{this.state.name==""?"Create Group":this.state.name}</IonTitle>
        </IonItem>
        <IonItem>
          <IonInput id="namegroup" type="text" placeholder="Name Your Group"></IonInput>
          <IonButton onClick={() => this.nameGroup()}>Create Group</IonButton>
        </IonItem>
        {this.state.name=="" && (
          <IonItem >
            <IonText color="medium">
              Before you can add members, you need to give the group a name.
            </IonText>
          </IonItem>
        )}
        {this.state.name!="" && (<>
          <IonItem>
            <IonText color="medium">
              Click the (✓) button to create the group "{this.state.name}".
              As the creator, you will be added to it automatically.
            </IonText>
          </IonItem>
          <IonItem>
           <IonText color="medium">
           To add other people, give them the code listed for {this.state.name} on your Groups page.
            They must enter the code on their Groups page.
           </IonText>
          </IonItem>
        </>)}
      </IonCard>
       {/*<IonCard>
         <IonItem>
          <IonTitle>Adding Members:</IonTitle>
        </IonItem> */}
        {/* {this.state.name=="" && (
          <IonItem>
            Before you can add members, you need to give the group a name.
          </IonItem>
        )}
        {this.state.name!="" && (<>
          <IonItem>
            Click the (✓) button to create the group "{this.state.name}".
            As the creator, you will be added to it automatically.
          </IonItem>
          <IonItem>
            To add other people, give them the code listed for {this.state.name} on your Groups page.
            They must enter the code on their Groups page.
          </IonItem>
        </>)} 
      </IonCard>*/}
    </>);
  }
}

/*<IonCard>
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
    </IonCard>*/

export default GroupCreator;
