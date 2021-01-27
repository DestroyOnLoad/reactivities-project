import React from "react";
import { Button, Container, Menu } from "semantic-ui-react";

interface IProps {
  handleCreateActivityForm: () => void;
}

export const NavBar: React.FC<IProps> = ({ handleCreateActivityForm }) => {
  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item>
          <img src="/assets/logo.png" alt="logo" style={{ marginRight: 10 }} />
          Reactivities
        </Menu.Item>
        <Menu.Item name="Activities" />
        <Menu.Item>
          <Button
            positive
            type="button"
            content="Create Activity"
            onClick={handleCreateActivityForm}
          />
        </Menu.Item>
      </Container>
    </Menu>
  );
};
