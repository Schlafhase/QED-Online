import {
  Anchor,
  Divider,
  Grid,
  GridCol,
  Space,
  Stack,
  Title,
} from "@mantine/core";
import "./AppFooter.tsx.css";

export function AppFooter() {
  return (
    <div className="footer">
      <Divider my="md" />
      <Grid justify="space-around">
        <GridCol className="column" span={3}>
          <Title order={3}>QED</Title>
          <Space h={10} />
          <span className="minor">
            Eine unabhängige Schüler*innenzeitung am{" "}
            <Anchor href="https://hhgym.de">Heinrich-Hertz-Gymnasium</Anchor>.
          </span>
        </GridCol>
        <GridCol span={1} />
        <GridCol className="column" span={3}>
          <Title order={3}>Über uns</Title>
          <Space h={10} />
          <Stack className="minor" gap={0}>
            <Anchor>Redaktion</Anchor>
            <Anchor>Impressum</Anchor>
            <Anchor>Archiv</Anchor>
            <Anchor>Kontakt</Anchor>
          </Stack>
        </GridCol>
      </Grid>
    </div>
  );
}
