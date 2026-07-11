"use client";
import { Text, Center, Title, List, ListItem } from "@mantine/core";
import QED from "./QED";
import Quote from "./Quote";

export default function Values() {
  return (
    <>
      <Center>
        <Title>Unsere Werte</Title>
      </Center>
      <p>
        Die <QED /> wurde als eine Zeitung gegründet, die besonderen Wert auf
        gründliche Recherche, journalistische Sorgfalt, Meinungsvielfalt und
        eine für Schüler*innen interessante Themenwahl legt. Zur Idee der
        Gründung hat besonders unsere Wahrnehmung des HertzSchlags beigetragen.
        Die wichtigsten Aspekte, die wir beim HertzSchlag unbefriedigend fanden,
        waren:
      </p>
      <Text c={"dimmed"} fs={"italic"} mb={"md"}>
        Die Aspekte beziehen sich natürlich nur auf den HertzSchlag zu dem
        damaligen Zeitpunkt (2025/2026). Wie sich der HertzSchlag
        weiterentwickeln wird ist unklar.
      </Text>
      <List type="ordered">
        <ListItem>
          <Text fw={700}>Qualität der Artikel und Lesespaß</Text>
          <p>
            Viele der Artikel im HertzSchlag fanden wir sprachlich und
            journalistisch nicht überzeugend. Außerdem fanden wir, dass die
            Themen nicht gut gewählt waren. Statt aktuellen, (schul-)
            politischen Themen fand man hauptsächlich rein informative Artikel
            ohne eine eigene Meinung, die man ähnlich auch auf Plattformen wie
            Wikipedia finden würde. Damit ist unserer Meinung nach das Ziel der
            Presse verfehlt.
          </p>
          <p>
            Bei der <QED /> legen wir großen Wert auf die Qualität unserer
            Artikel, in denen wir auch unsere Pressefreiheit ausnutzen und von
            unserer Meinung berichten. Wir wollen eine hohe Qualität
            garantieren, indem jeder Artikel an unser Lektorat geschickt wird,
            das nicht nur auf sprachliche Fehler sondern auch auf Schreibstil
            und andere qualitative Merkmale achtet. Außerdem versuchen wir
            hauptsächlich Themen zu wählen, die aktuell sind und viele von uns
            Schüler*innen betreffen. Wir geben uns große Mühe bei unseren
            Recherchen. Dafür fragen wir Interviews an oder reisen in andere
            Städte, um beispielsweise bei großen Demos vor Ort zu sein.
          </p>
        </ListItem>
        <ListItem>
          <Text fw={700}>Wahrhaftigkeit und Sorgfalt</Text>
          <p>
            Einige Artikel des HertzSchlags enthalten sachliche Fehler. Das
            liegt meistens daran, dass nicht gut recherchiert wurde oder Quellen
            nicht richtig überprüft wurden.
          </p>
          <p>
            Wir geben uns die große Mühe, immer wahrheitsgetreu zu berichten,
            sorgfältig zu recherchieren und Quellen zu überprüfen. Wir
            versuchen, unsere Informationen möglichst durch mehrere unabhängige
            Quellen zu belegen.
          </p>
        </ListItem>
        <ListItem>
          <Text fw={700}>Zivilcourage</Text>
          <p>
            Die ursprüngliche Idee, die <QED /> zu gründen, entstand, als Linus
            Schneeberg von mehreren Vorwürfen gegen unsere Schulleitung erfahren
            hat und gerne einen Artikel darüber schreiben wollte. Der
            HertzSchlag wollte für so einen Artikel allerdings keine
            Verantwortung übernehmen.
          </p>
          <p>
            Viele Schüler*innen haben Angst davor, nach der Veröffentlichung
            eines solchen Artikels, von Lehrer*innen oder der Schulleitung
            benachteiligt zu werden oder andere Konsequenzen zu erfahren.
          </p>
          <p>
            Wir finden das zwar verständlich, aber sehr problematisch, weil man
            sich, besonders in einem demokratischen Rechtsstaat wie unserem, ja
            eigentlich frei und ohne Angst äußern sollte. Der HertzSchlag muss
            natürlich kein politisches Medium sein, aber es muss trotzdem ein
            Medium geben, in dem offen und transparent berichtet wird, auch wenn
            das bedeutet, dass kritisch über mächtigere Personen geschrieben
            wird.
          </p>
        </ListItem>
      </List>
      <p>
        Zur Wichtigkeit der Pressefreiheit und Zivilcourage, auch an Schulen,
        und der Einstellung unserer Schulleitung dazu wird es einen Artikel in
        unserer ersten Ausgabe <Quote>[Name der Ausgabe]</Quote> geben.
      </p>
    </>
  );
}
