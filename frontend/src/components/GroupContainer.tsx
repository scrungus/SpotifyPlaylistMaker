import './GroupContainer.css';
import { people } from 'ionicons/icons';
import { IonItem, IonImg, IonThumbnail, IonTitle } from '@ionic/react';

interface ContainerProps {
  groupName: string;
}

// Group component for groups in Groups tab
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
