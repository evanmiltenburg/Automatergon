const cellWidth = 6;
const colors = ['black', 'blue', 'red', 'green']

const langeVocalen = ['aa','ee','oo','uu','oe','ie','ui','eu','au','ei']
const korteVocalen = ['a','e','i','o','u']
const coda = ['s','t','l','p', 'r', 'g','f','m','n', 'k']//d en b zie ik niet in compoëzie.
const onset = ['b','bl','br',
               'd','dw','dr',
               'f','fn','fr','fl',
               'g','gr','gn','gl',
               'h',
               'j',
               'k','kl','kw','kn','kr',
               'l',
               'm',
               'n',
               'p','pr','pl',
               's','sn','sl','sm','st','sj','sp',
               'str','sch','schr','spr',
               'tj','tj','tr','tw',
               'v',
               'w',
               'z','zw',
               '']

// Origineel:
// De woorden, die in één bepaald gedicht gebruikt worden, zijn gegroepeerd in
// ‘categorieën’. Deze categorisering verloopt volgens één van twee principes:
//  a naar vocaal, zoals in AUTOMATERGON 72-20S
//  b naar beginconsonant, zoals in AUTOMATERGON 72-7S
//
// Commentaar: hier geimplementeerd als keuzemenu. (Variabele: category)

// Origineel:
// binnen één vers zijn ófwel uitsluitend korte, ófwel uitsluitend lange vocalen gebruikt.
//
// Commentaar Emiel: 
// Dat klopt niet met automatergon 72 – 21 S, variant 4, 
// waar bijvoorbeeld 'uu' en 'a' gebruikt worden.
//
// Hier geimplementeerd als keuzemenu. (Variabele: vocals)

function* wordGenerator(onsets, vocals, final){
    while (true){
        var word = [randomItem(onsets), randomItem(vocals), final].join('');
        yield word;
    }
}

function optionMap(numItems, category, vocals, maxConsonanten){
    // numItems: aantal opties.
    // category: vocaal of consonant (de beginconsonant)
    // vocals: lang, kort, of beiden.
    // maxConsonanten: maximaal aantal verschillende consonanten.
    
    switch (vocals){
        case "lang":
            selectedVocals = langeVocalen;
            break;
        case "kort":
            selectedVocals = korteVocalen;
            break;
        case "beiden":
            selectedVocals = langeVocalen.concat(korteVocalen);
    }
    
    // Origineel:
    //Het materiaal: steeds eenlettergrepige woorden; 
    //binnen één vers hebben alle woorden dezelfde eindconsonant; 
    eindConsonant = randomItem(coda);
    console.log("Eindconsonant is:", eindConsonant);
    // Origineel:
    // In elk vers is een aantal verschillende beginconsonanten gebruikt 
    // (echter nooit alle mogelijkheden).
    //
    // Commentaar Emiel: 
    // Er zijn zoveel beginconsonanten dat we dit bijna niet hoeven te begrenzen.
    // Momenteel zijn er 47 beginconsonanten geïmplementeerd.
    //
    // Twee opties:
    // - Organisatie op basis van beginconsonant: hier vindt al een selectie plaats.
    // - Organisatie op basis van vocaal: hier wordt selectie relevant wanneer er 
    //   meer dan 47 woorden zijn in het grid. We kunnen de begrenzing instellen via
    //   het keuzemenu.
    if (category=="vocaal"){
        // TODO
        // Mogelijke onsets binnen het huidige gedicht.
        var onsetSelection = getRandomSubarray(onset, maxConsonanten);
        // Verdere selectie van de vocalen.
        selectedVocals = getRandomSubarray(selectedVocals, numItems);
        console.log("Vocalen zijn:", selectedVocals);
        var options = {};
        for (var i=0; i<selectedVocals.length; i++) {
            vocal = selectedVocals[i];
            options[vocal] = wordGenerator(onsetSelection, [vocal], eindConsonant);
        }
        return options;
    } else if (category=="consonant"){
        var selectedOnsets = getRandomSubarray(onset, numItems);
        var options = {};
        for (var i=0; i<selectedOnsets.length; i++) {
            currentOnset = selectedOnsets[i];
            options[currentOnset] = wordGenerator([currentOnset], selectedVocals, eindConsonant);
        }
        return options;       
    }
}


class Grid {
    constructor(width, height){
        this.filled = 0;
        this.width = width;
        this.height = height;
        this.size = width * height;
        this.grid = new Array(height);
        for (var i = 0; i < height; i++) {
            this.grid[i] = new Array(width).fill(['','black']);
        }
    }
    
    fill(width, height, word, color){
        this.grid[height][width] = [word, color]
        this.filled += 1            
    }
    
    get(width, height){
        return this.grid[height][width]
    }
    
    isFilled(x,y){
        return Boolean(this.grid[y][x][0])
    }
    
    pushIfEmpty(x,y, arr){
        if (!this.isFilled(x,y)){arr.push([x,y])}
    }
    
    getAvailableNeighbors(x,y){
        var neighbors = Array();
        if (y>0){this.pushIfEmpty(x,y-1, neighbors)}
        if (y<(this.height-1)){this.pushIfEmpty(x,y+1,neighbors)}
        if (x > 0){
            this.pushIfEmpty(x-1,y, neighbors)
            if (y>0){this.pushIfEmpty(x-1,y-1, neighbors)}
            if (y<(this.height-1)){this.pushIfEmpty(x-1,y+1,neighbors)}
        }
        if (x < (this.width-1)){
            this.pushIfEmpty(x+1,y, neighbors)
            if (y>0){this.pushIfEmpty(x+1,y-1, neighbors)}
            if (y<(this.height-1)){this.pushIfEmpty(x+1,y+1,neighbors)}
        }
        return neighbors
    }
}


function drawGrid(grid){
    var result = document.getElementById("resultaat-inhoud")
    result.innerHTML = ''; //clear HTML before inserting again
    
    for (var y=0; y < grid.height; y++) {
        toPrint = new Array(grid.width);
        for (var x=0; x < grid.width; x++) {
            //change later to switch between padStart and padEnd
            padded = grid.grid[y][x][0].padStart(cellWidth, ' ');
            color = grid.grid[y][x][1]
            toPrint.push(`<span style='color:${color}'>${padded}<span>`);
        }
        
        // No idea why we need to slice the string, 
        // but else there are 30 superfluous spaces.
        var line = toPrint.join(' ').slice(grid.width);
        var row = result.insertRow(-1);
        var cell = row.insertCell(-1);
        cell.innerHTML = line;
    }
    result.style.display = 'inline-block';
}

function createGrid(width, height){
    var grid = new Grid(width,height);
    return grid
}

/*****************************************************************/
// RANDOM FUNCTIONS FROM STACK OVERFLOW:
/*****************************************************************/

// https://stackoverflow.com/a/7228322
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// https://stackoverflow.com/a/5915122
function randomItem(items){
    return items[Math.floor(Math.random()*items.length)];
}

// https://stackoverflow.com/a/11935263
function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}
/*****************************************************************/

function fillGrid(grid, vocals, maxConsonanten, variants, category, numColors, minPercent, maxPercent, minChain, maxChain){
    // Percentage berekenen
    var fillPercent = randomIntFromInterval(minPercent, maxPercent);
    var fillTarget = Math.floor((grid.size/100) * fillPercent);
    console.log(`We vullen ${fillTarget} van de ${grid.size} cellen. (${fillPercent} procent)`);
    
    // Kleuren selecteren
    if (numColors==1){
        var usedColors = ['black']
    } else {
        var usedColors = getRandomSubarray(colors, numColors);
    }
    console.log(`Aantal kleuren: ${numColors}, namelijk ${usedColors}`)
    
    var options = optionMap(variants, category, vocals, maxConsonanten)
    
    while (grid.filled < fillTarget) {
        // Startpunt voor deze ronde
        randX = randomIntFromInterval(0, grid.width-1)
        randY = randomIntFromInterval(0, grid.height-1)
        
        if (grid.isFilled(randX,randY)){
            continue;
        }
        
        // Kleur voor deze ronde
        randColor = randomItem(usedColors)
        
        // Lengte keten voor deze ronde, voor zover mogelijk.
        var chainLength = randomIntFromInterval(minChain, maxChain);
        var remainingSpace = fillTarget - grid.filled;
        var toAdd = Math.min(chainLength, remainingSpace);
        
        // Key voor deze ronde
        var key = randomItem(Object.keys(options));
        
        // Zolang er nog items zijn in de huidige keten.
        while (toAdd > 0){
            // Genereer woord
            var word = options[key].next().value;
            // Begin met de locatie die we eerder hebben geselecteerd.
            grid.fill(randX,randY, word, randColor);
            
            // Na het vullen hoeven we er eentje minder te plaatsen.
            toAdd--;
            
            // Zoek naar buren van de oorspronkelijke coordinaten.
            var neighbors = grid.getAvailableNeighbors(randX,randY);
            
            // Als er geen buren meer zijn, dan houdt het op.
            if (neighbors.length == 0){
                break; // stop met kijken op deze locatie.
            }
            
            // Selecteer willekeurige buur.
            var neighbor = randomItem(neighbors);
            randX = neighbor[0];
            randY = neighbor[1];
        }
    }
// Check if fill works:
//    console.log(grid.filled);
//    grid.fill(4,0, "bla", 'black');
//    console.log(grid.filled);
}

function changeStart(){
    document.getElementById("start").value = randomIntFromInterval(0,1000);
}

function processForm(){
    var start = document.getElementById("start").value;
    var vocalen = document.getElementById("vocalen").value;
    var maxConsonanten = parseInt(document.getElementById("max-cons").value);
    var varianten = parseInt(document.getElementById("aantal-varianten").value);
    var categorie = document.getElementById("categorie").value;
    var kleuren = parseInt(document.getElementById("aantal-kleuren").value);
    var breedte = parseInt(document.getElementById("raster-breedte").value);
    var hoogte = parseInt(document.getElementById("raster-hoogte").value);
    var minProcent = parseInt(document.getElementById("min-procent").value);
    var maxProcent = parseInt(document.getElementById("max-procent").value);
    var minKeten = parseInt(document.getElementById("min-keten").value);
    var maxKeten = parseInt(document.getElementById("max-keten").value);
    
    var genDetails = [
        `Automatisch gegenereerd op basis van onderstaande volgende gegevens.<br />`,
        `Start: ${start}, Kleuren: ${kleuren}, Hoogte: ${hoogte}, Breedte: ${breedte}.<br />`,
        `Varianten: ${varianten}, Geordend op ${categorie}, Vocalen: ${vocalen}.<br />`,
        `Vulling tussen ${minProcent} en ${maxProcent} procent, Ketens tussen ${minKeten} en ${maxKeten} woorden.`
    ]
    var gendetails = document.getElementById("generation-details")
    gendetails.innerHTML = genDetails.join(' ')
    
    Math.seedrandom(start);
    
    // Log alle data.
    console.log("Form data:")
    console.log("Start:", start)
    console.log("Varianten:", varianten)
    console.log("Kleuren:", kleuren)
    console.log("Omvang:", breedte, hoogte);
    console.log("Vulling:", minProcent, maxProcent);
    console.log("Ketens:", minKeten, maxKeten);
    
    grid = createGrid(breedte, hoogte);
    fillGrid(grid, vocalen, maxConsonanten, varianten, categorie, kleuren, minProcent, maxProcent, minKeten, maxKeten);
    drawGrid(grid);
}
