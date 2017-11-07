
function  generateInputSet(setType,noteCount) {
    var result = [];
    switch (setType) {
        case "Integers":
            result = getIntegerSet (noteCount);
            break;
        case "Sine":
            result = getSineSet (noteCount);
            break;
        case "Fibonacci":
            result = getFibonacciSet (noteCount);
            break;
        case "Pascal":
            result = getPascalSet (noteCount);
            break;
        case "Powers":
            result = getPowerSet (noteCount);
            break;
        case "Phi":
            result = getPhiSet (noteCount);
            break;
        case "Pi":
            result = getPiSet (noteCount);
            break;
        case "E Constant":
            result = getESequence (noteCount);
            break;
        case "DNA":
            result = getDNA (noteCount);
            break;
        case "RNA":
            result = getRNA (noteCount);
            break;
        case "Protein":
            result = getProtein (noteCount);
            break;
        case "Custom":
            result = "Please enter your own set of input...";
            break;
    }
    return result;

}
//get integers
function getIntegerSet(noteCount){
    var result = [];
    for(var i = 0; i < noteCount; i++)
    {
        result.push(i);
    }
    return result;
}

//get sine set
function getSineSet(noteCount){
    var result = [];
    var value;

    for(var i=0; i<noteCount*11; i = i+11)
    {
        value = i * Math.PI / 180;
        value = 100*Math.sin(value);
        result.push(~~value);
    }
    return result;
}

//get Fibonacci set
function getFibonacciSet(noteCount){
    var result = [];
    var a = 0, b = 1, temp;

    while (noteCount > 0){
        temp = a;
        a = a + b;
        b = temp;
        result.push(b);
        noteCount--;
    }

    return result;
}

//get Pascal set
function getPascalSet(noteCount){
    var _value = new Array();
    var row;
    var value;
    var countDigit = 1;
    var rowNum = findRowInPascal(noteCount);

    for(var i=0; i<= rowNum; i++)
    {
        row = i+1;
        value = 1;
        for(var column=0; (column <= i) && (countDigit <= noteCount); column++)
        {
            if(column > 0)
            {
                value = value * (row - column) / column;
            }
            _value.push(value);
            countDigit++;
        }
    }
    return _value;

}
function findRowInPascal(c){
    //using formula (n*(n+1))/2 = c with quadratic frormula

    if(c == 0) return 0;//How will we error check

    var cTerm = -((c-0.5)*2);
    var quadraticFormula = ((-1)+ Math.sqrt(1-(4*cTerm)))/2	;

    return Math.floor(quadraticFormula)+1;
};

//get Powers set
function getPowerSet(noteCount){
    var _value = new Array();

    for(k =0 ; k < noteCount; k++){
        _value.push(k*k);
    }

    return _value;
}

//Phi (Golden Ratio) Sequence class
function getPhiSet(noteCount){
    var _value = new Array();

    //if a higher base used, calculation speed increase and digit count increse.
    var base=10,b=0,c=3434,d=0,n=noteCount,k=0;
    var f = new Array(3435);

    while(b<c){
        f[b++]=1;
    }

    f[1] += 5;//square root 5

    while(n-- > 0){
        d=0;
        k=c;
        while(--k >0){

            b = 10*k;
            d += f[k]*base;
            f[k] = d % b;
            d = ~~(d/b);
            d *= 2*k-1;
        }

        d += f[0]*base;
        _value.push(~~(d/base));
        f[0] = d%base;
    }

    return _value;
}

//Pi Sequence using spigot  by Stephen R. Schmitt
function getPiSet(noteCount)
{
    var _value = new Array();

    if(noteCount <1){
        _value.push(0);
        return _value;//important to have
    }


    var useValue = noteCount;

    if (useValue % 4)
        useValue = useValue + (4 - (useValue % 4));


    var size = Math.floor(useValue*14/4);
    var x = "";
    var a, b, c, d, e, g, n, m;
    var f = new Array(size + 1);
    var splitter;

    a = 10000; //base 10000 increase the speed of algorithm
    b = 1;
    c = size;
    e = 0;

    while (b != c)                          // init array
    {
        f[b] = Math.floor(a/5);
        b++;
    }
    f[c] = 0;


    while (c > 0)                           // start algorithm
    {
        g = 2*c;
        d = 0;
        b = c;
        while (b > 0)                       // inner loop
        {
            d = d + f[b]*a;
            g = g - 1;
            f[b] = d % g;
            d = Math.floor(d/g);
            g = g - 1;
            b = b - 1;                      // decrement inner loop counter
            if (b != 0)
                d = d*b;
        }

        c = c - 14;                         // decrement outer loop counter

        // output four digits
        x = zintstr(e +Math.floor(d/a), 4);

        splitter = x;
        for(var i=1; i<=4; i++){
            if(_value.length == noteCount) break;

            _value.push(splitter.substring(i,i+1));
        }

        e = d % a;
    }

    var result=[];
    for (var x in _value) {
        result.push(parseInt(_value[x]));
    }
    return result;
}

// format a positive integer with leading zeroes
function zintstr( num, width )
{
    var str = num.toString(10);
    var len = str.length;
    var intgr = " ";
    var i;

    // append leading spaces
    for (i = 0; i < width - len; i++)
        intgr += '0';

    // append digits
    for (i = 0; i < len; i++)
        intgr += str.charAt(i);

    return intgr;
};

function getESequence(noteCount) {
    var _value = new Array();

    if(noteCount <1){
        return _value;
    }

    if(noteCount  == 1){
        _value.push(2);
        return _value;
    }

    _value.push(2);
    var size = Math.floor(parseInt(noteCount,10) + 8);
    var N = size;
    var n;

    var a = new Array(N);
    a[0] = 0;
    a[1] = 0;
    for (i = 2; i < size; i++) a[i] = 1;

    var x = 0;
    while (N > 9)
    {
        // generate next digit

        for (n = N; n > 0; n--)
        {
            a[n] = x%n;
            x = 10*a[n-1] + Math.floor(x/n);
        }
        _value.push(x);
        N--;
    }
    return _value;

}

function getDNA(noteCount) // Cannot exceed 63
{
    var originalDNASequence=["A","C","A","T","G","A","G","A","C","A","G","A","C","A","G","A","C"
        ,"C","C","C","C","A","G","A","G","A","C","A","G","A","C","C","C","C","T","A","G","A","C","A",
        "C","A","G","A","G","A","G","A","G","T","A","T","G","C","A","G","G","A","C","A","G","G","G"];

    var result = [];
    if(noteCount > 63)
    {
        alert("Cannot exceed 63");
    }

    for(var i = 0; i < noteCount; i++)
    {
        result.push(originalDNASequence[i]);
    }
    return result;
}

function getRNA(noteCount) // Cannot exceed 35
{
    var originalRNASequence=["A","U","G","G","A","A","U","U","C","U","C","G","C","U","C","A","U"
        ,"G","G","A","A","U","C","U","C","G","C","U","C","A","A","U","A","U","G"];

    var result = [];
    if(noteCount > 63)
    {
        alert("Cannot exceed 63");
    }

    for(var i = 0; i < noteCount; i++)
    {
        result.push(originalRNASequence[i]);
    }
    return result;
}

function getProtein(noteCount)
{
    //There are  50 values in the array
    var originalProteinSequence=["E","G","L","R","I","W","V","F","C","I","R","Y","K","K","G","N",
        "S","G","A","L","Q","N","P","E","L","D","V","G","L","V","T","A",
        "I","A","R","F","S","T","L","T","K","M","S","D","Q","D","E","A","P","H"];

    //var originalProteinSequence =["W","F","L"];
    var result = [];


    for(var i = 0; i < noteCount; i++)
    {
        result.push(originalProteinSequence[i]);
    }
    return result;
}