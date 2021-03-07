import './GroupContainer.css'
import { people } from 'ionicons/icons';
import { IonItem, IonAvatar, IonLabel, IonImg, IonRow, IonThumbnail, IonTitle } from '@ionic/react';

interface ContainerProps {
  groupName: string;
}

const GroupContainer: React.FC<ContainerProps> = props => {
  return (
    <IonItem>
      <IonThumbnail slot="start">
        <IonImg src={people}></IonImg>
      </IonThumbnail>
      <IonTitle>{props.groupName}</IonTitle>
    </IonItem>
  );
};

export default GroupContainer;
