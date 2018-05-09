let wrap = document.getElementById('wrap');
let imgs = document.getElementsByTagName('img');

let len = imgs.length;
let ang = 360 / len ;

function to3D(eles){
    let width = eles[0].clientWidth/2;
    // let ang = 360 / len / 2;
    let r = width/Math.tan(ang/ 2 / 180 * Math.PI) + 35;
    for(let i = 0;i<eles.length;i++){
        eles[i].style = `transform: rotateY(${ang*i}deg) translateZ(${r}px);`;
    }
}

wrap.addEventListener('click',function(){
    // console.log(this.style);
    if(this.style.transform !== ''){
        let angtoadd = this.style.transform.match(/\d{1,}/);
        console.log(ang);
        let newang = angtoadd/1 + ang;
        this.style = `transform: rotateY(${newang}deg);`
    }else{
        this.style = `transform: rotateY(${ang}deg);`;
    }
});
to3D(imgs);
