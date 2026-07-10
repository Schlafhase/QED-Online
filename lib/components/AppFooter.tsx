import {
  Anchor,
  Divider,
  Grid,
  GridCol,
  SimpleGrid,
  Space,
  Stack,
  Title,
} from "@mantine/core";
import "./AppFooter.tsx.css";

export function AppFooter() {
  return (
    <div className="footer">
      <Divider my="md" />
      <SimpleGrid mx={{ base: 50, sm: 200 }} cols={{ base: 1, md: 3 }}>
        <div>
          <Title order={3}>QED</Title>
          <Space h={10} />
          <span className="minor">
            Eine unabhängige Schüler*innenzeitung am{" "}
            <Anchor href="https://hhgym.de">Heinrich-Hertz-Gymnasium</Anchor>.
          </span>
        </div>
        <div></div>
        <div>
          <Title order={3}>Über uns</Title>
          <Space h={10} />
          <Stack gap={0}>
            <Anchor>Redaktion</Anchor>
            <Anchor>Impressum</Anchor>
            <Anchor>Archiv</Anchor>
            <Anchor>Kontakt</Anchor>
          </Stack>
        </div>
      </SimpleGrid>
    </div>
  );
}
