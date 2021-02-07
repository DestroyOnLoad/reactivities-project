import React from "react";
import {
  Segment,
  Item,
  Header,
  Button,
  Grid,
  Statistic,
  Divider,
  Reveal,
} from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { IProfile } from "../../app/models/profile";

interface IProps {
  profile: IProfile;
  loading: boolean;
  isCurrentUser: boolean;
  followUser: (username: string) => void;
  unfollowUser: (username: string) => void;
}

const ProfileHeader: React.FC<IProps> = ({
  profile,
  loading,
  isCurrentUser,
  followUser,
  unfollowUser,
}) => {
  return (
    <Segment>
      <Grid>
        <Grid.Column width={12}>
          <Item.Group>
            <Item>
              <Item.Image
                avatar
                size="small"
                src={profile?.image || "/assets/user.png"}
              />
              <Item.Content verticalAlign="middle">
                <Header as="h1">
                  {profile?.displayName || "Display Name"}
                </Header>
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={4}>
          <Statistic.Group widths={2}>
            <Statistic label="Followers" value={profile?.followersCount || 0} />
            <Statistic
              label="Following"
              value={profile?.followingsCount || 0}
            />
          </Statistic.Group>
          <Divider />
          {!isCurrentUser && (
            <Reveal animated="move">
              <Reveal.Content visible style={{ width: "100%" }}>
                <Button
                  fluid
                  color="teal"
                  content={profile?.isFollowing ? "Following" : "Not Following"}
                />
              </Reveal.Content>
              <Reveal.Content hidden>
                <Button
                  fluid
                  basic
                  color={profile?.isFollowing ? "red" : "green"}
                  content={profile?.isFollowing ? "Unfollow" : "Follow"}
                  loading={loading}
                  onClick={
                    profile?.isFollowing
                      ? () => unfollowUser(profile.username)
                      : () => followUser(profile.username)
                  }
                />
              </Reveal.Content>
            </Reveal>
          )}
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default observer(ProfileHeader);
