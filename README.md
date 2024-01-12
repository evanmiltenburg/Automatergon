# Automatergon
Een herimplementatie van de digitale poëzie van Greta Monach, zoals 
omschreven in haar 
[Compoëzie](https://ooteoote.nl/2020/02/greta-monach-compoezie/).
Je kunt de website [hier](https://automatergon.emielvanmiltenburg.nl) 
bekijken.

## Het project
Het doel van dit project is om het werk van Greta Monach publiek beschikbaar te maken.
Hiervoor is er gekozen voor een implementatie in JavaScript, een 
programmeertaal die geschikt is voor het maken van interactieve websites.
De generator is geprogrammeerd op basis van de omschrijving in haar boek 
[Compoëzie](https://ooteoote.nl/2020/02/greta-monach-compoezie/). Hoewel 
de beschrijving van Monach erg uitgebreid is, ontbreken er toch enkele 
implementatiedetails. Dat maakt dat dit slechts een benadering is van het 
oorspronkelijke werk.

### Willekeurige getallen
JavaScript heeft zelf geen "seeded random number generator." Dat wil 
zeggen dat de reeks willekeurige getallen die de software intern 
genereert, niet te reproduceren valt. Een "seeded random number generator" 
produceert (pseudo-)willekeurige getallen op basis van een initiële 
startwaarde. Wanneer je dezelfde startwaarde (de "random seed") gebruikt, 
zul je ook altijd dezelfde reeks willekeurige getallen krijgen. Dat zorgt 
ervoor dat de output van het programma op het oog willekeurig is, maar wel 
reproduceerbaar blijft. Voor dit project maak ik gebruik van de 
[Seedrandom](https://github.com/davidbau/seedrandom)-generator die gemaakt 
is door David Bau. Deze generator wordt verstrekt onder de MIT-licentie; 
een vrije licentie die ook voor dit project van toepassing is.

Greta Monach noemt in haar werk een START-variabele, die verder nergens uitgelegd 
wordt, maar ik neem aan dat deze variabele verwijst naar een startwaarde 
zoals hierboven omschreven.

## Licentie
Deze generator wordt verstrekt onder de MIT-licentie. Voel je vrij om deze 
generator te kopiëren, aan te passen, of zelf te uploaden op je eigen 
server. Een verwijzing naar de originele versie wordt gewaardeerd.
