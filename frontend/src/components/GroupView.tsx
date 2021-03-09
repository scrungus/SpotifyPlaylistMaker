import { 
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonContent, 
  IonTitle, 
  IonItem,
  IonImg} from '@ionic/react';
import { people } from 'ionicons/icons';

interface ContainerProps {
  groupName: string;
}

// Component displayed in modal after group is tapped in Groups tab
const GroupView: React.FC<ContainerProps> = props => {
  const members = ["Eddie", "Jack", "Mark", "Bob"];

  return (
    <IonContent color="light">
      <IonItem>
        <IonImg src={people}></IonImg>
      </IonItem>
      <IonTitle>Members</IonTitle>
      {members.map((member: string, index: number) => (
        <IonItemSliding key={index}>
          <IonItem>
            <IonLabel>{member}</IonLabel>
          </IonItem>
      
          <IonItemOptions side="end">
            <IonItemOption color="danger" onClick={() => console.log('delete clicked')}>Delete</IonItemOption>
          </IonItemOptions>
      </IonItemSliding>
      ))}
    </IonContent>
  );
};

export default GroupView;
