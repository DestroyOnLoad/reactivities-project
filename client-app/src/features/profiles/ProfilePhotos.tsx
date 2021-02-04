import React, { useContext } from "react";
import { Card, Header, Image, Tab } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";

export const ProfilePhotos = () => {
  const rootStore = useContext(RootStoreContext);
  const { profile } = rootStore.profileStore;
  return (
    <Tab.Pane>
      <Header icon="image" content="Photos" />
      <Card.Group itemsPerRow={5}>
        {profile &&
          profile.photos != null &&
          profile.photos.map((photo) => {
            return (
              <Card key={photo.id}>
                <Image src={photo?.url} size="medium" />
              </Card>
            );
          })}
      </Card.Group>
    </Tab.Pane>
  );
};
