"use client";

import { Anchor, Blockquote, List, ListItem, Text } from "@mantine/core";
import { InfoIcon } from "@phosphor-icons/react";

export default function TesterInformation() {
  return (
    <Blockquote
      my={"md"}
      iconSize={25}
      color="blue"
      radius={0}
      title="Info"
      icon={<InfoIcon size={30} />}
    >
      <Text fw={700}>Information for Testers and Reviewers</Text>
      This project is not about the articles hosted on it (there aren't any real
      articles on this instance). The main features I worked on are actually:
      <List>
        <ListItem>Creation of collections, editions and articles</ListItem>
        <ListItem>
          Unlocking collections with codes (You can find collections on the
          start page)
        </ListItem>
      </List>
      You can test them on the <Anchor href="/admin">Admin page</Anchor>. The
      password is <b>123</b>.
    </Blockquote>
  );
}
