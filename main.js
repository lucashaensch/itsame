var fase;
var energia;
var pontos;
var nobstaculos;
var saltando;
var salto_ok;                 // indica se o personagem fez um salto OK
var saltou;                   // indica se o personagem saltou durante a passagem de um obstáculo (se não saltou houve colisão)
// var saltando_obstaculo;
var conta_obstaculos;
var vel_fundo;
var vel_1o_plano;
var ts_inicio_anim_obs;

var flag_mudou_fase;

var WIDTH_PLANO_DE_FUNDO = 3180;  // número de pixels da largura da imagem
var WIDTH_JANELA = 1000;          // largura da janela

/* para cÃ¡lculo da colisÃ£o:

personagem percorre 150 pixels em metade do tempo_animacao_personagem

obstaculo do tipo 1 tem 50 x 80 pixels e do tipo 2 tem 80 x 80 pixels

obstaculo percorre (1080 / tempo_1o_plano ) * tempo_animacao_personagem  pixels, durante salto

*/

function inicio()
{
  console.log("inicio()");
  
  fase = 1;
  nobstaculos = 15;
  vel_fundo = 50;
  vel_1o_plano = 400;
  
  limpa_displays();
  seta_listeners();

  inicia_fase();
  inicia_anim_obstaculo();
}

function inicia_fase()
{
  console.log("inicia_fase("+fase+")");

  // inicialização de flags de controle
  saltando = false;
  salto_ok = false;
  saltou = false;

  // inicialização do número de obstáculos que já passaram na fase
  conta_obstaculos = 0;
  
  // inicialização do momento de início da animação do obstáculo
  ts_inicio_anim_obs = 0;

  // recalcula tempos das animações
  calcula_tempos(); 
}

function seta_listeners()
{
  console.log("seta_listeners");
  
  var pers_el = window.document.getElementById("personagem");
  pers_el.addEventListener("webkitAnimationIteration", fim_do_salto);
  pers_el.addEventListener("animationIteration", fim_do_salto);
  pers_el.focus();

  var obstaculo_el = window.document.getElementById("obstaculo1");
  obstaculo_el.addEventListener("webkitAnimationIteration", final_anim_obstaculo);
  obstaculo_el.addEventListener("animationIteration", final_anim_obstaculo);

}

// função chamada para iniciar a animação do obstáculo
function inicia_anim_obstaculo()
{
  console.log("inicia_anim_obstaculo()");
  var obs_el = window.document.getElementById("obstaculo1");
  // associação da classe anima_obstaculo1 vai provocar o início da animação
  obs_el.className = "anima_obstaculo1";

  // armazena o timestamp (tempo) que iniciou a animação do obstáculo
  var d = new Date();
  ts_inicio_anim_obs = d.getTime();
}

function final_anim_obstaculo()
{
  // incremento o número de obstáculos que já passaram
  conta_obstaculos++;
  console.log("final_anim_obstaculo() - "+conta_obstaculos);
  
  // se o personagem não teve um salto OK, então houve colisão!
  if (!saltou)
    colisao();
  saltou = false;
  
  // atualiza display de energia
  atualiza_display_energia();

  // remove animação do obstáculo (retira a classe que implementa a animação)
  var obs_el = window.document.getElementById("obstaculo1");
  obs_el.className = "";

  // verifica se houve mudança de fase
  verifica_mudanca_de_fase();

  // seta um tempo randômico entre (0,1s e 1,1s) para reiniciar animação do obstáculo
  window.setTimeout(inicia_anim_obstaculo,100+Math.floor(Math.random()*1000));
}

function verifica_mudanca_de_fase()
{
  console.log("verifica_mudanca_de_fase() => "+(conta_obstaculos)+" >= "+nobstaculos);
  if (conta_obstaculos >= nobstaculos)
    muda_fase();
}

function muda_fase()
{
  console.log("muda_fase()");
  
  ganha_energia(20);
  atualiza_display_energia();
  
  acrescenta_pontos(100+50*fase);
  atualiza_display_pontos();

  fase++;
  nobstaculos += 5;
  vel_fundo *= 1.5;
  vel_1o_plano *= 1.5;

  inicia_fase();
}

/* 
 * CALCULOS ÚTEIS PARA MUDANÇA DE FASES
 *  
 *  vel_fundo = WIDTH_PLANO_DE_FUNDO/tempo_animacao_fundo ==> tempo_animacao_fundo =  WIDTH_PLANO_DE_FUNDO / vel_plano_de_fundo;
   
   vel_1o_plano = (WIDTH_JANELA+80) / tempo_animacao_1o_plano ==> tempo_animacao_1o_plano = 1080 / vel_1o_plano;

   tempo_animacao_personagem = tempo_animacao_1o_plano / 3;

   A cada fase velocidade aumenta 50%...e se calculam os novos tempos
*/
function calcula_tempos()
{
  console.log("calcula_tempos()");

  var tempo_animacao_fundo = Math.round(WIDTH_PLANO_DE_FUNDO / vel_fundo);
  var el_plano2 = window.document.getElementById("plano2");
  el_plano2.style.WebkitAnimationDuration = tempo_animacao_fundo+"s";
  el_plano2.style.animationDuration = tempo_animacao_fundo+"s";
  console.log("Tempo plano de fundo:"+tempo_animacao_fundo);

  var tempo_animacao_1o_plano = Math.round(1000*(WIDTH_JANELA+80) / vel_1o_plano);
  var el_obs = window.document.getElementById("obstaculo1");
  el_obs.style.WebkitAnimationDuration = tempo_animacao_1o_plano+"ms";
  el_obs.style.animationDuration = tempo_animacao_1o_plano+"ms";
  console.log("Tempo 1o plano:"+tempo_animacao_1o_plano);

}

function limpa_displays()
{
  console.log("limpa_displays()");
  pontos = 0;
  energia = 100;
  atualiza_display_energia();
  atualiza_display_pontos();
}

function atualiza_display_energia()
{
  console.log("atualiza_display_energia()");
  var el = window.document.getElementById("display_energia");
  if (!el)
    return;
  el.innerHTML = '';
  // el.innerHTML = '<span>Energia: ' + energia + '</span>';
  if (energia > 0) {
    for (var i = 0; i < Math.floor(energia / 20); i++) {
      el.innerHTML += '<li class=\"full-life\"></li>';
    };
    if (energia % 20 == 10) {
      el.innerHTML += '<li class=\"half-life\"></li>';
    };
  };
}

function atualiza_display_pontos()
{
  console.log("atualiza_display_pontos()");
  var el = window.document.getElementById("display_pontos");
  if (!el)
    return;
  el.innerHTML = '<span>Pontos: '+pontos+'</span>';
}

function perde_energia(decremento)
{
  console.log("perde_energia("+decremento+")");
  energia -= decremento;

  // garante que energia seja menor que 0
  if (energia < 0)
    energia = 0;

  // se acabou a energia => jogo acabou
  if (energia == 0)
    finaliza_jogo();
}

function ganha_energia(incremento)
{
  console.log("ganha_energia("+incremento+")");
  energia += incremento;
  if (energia > 100)
    energia = 100;
}

function acrescenta_pontos(incremento)
{ 
  console.log("acrescenta_pontos("+incremento+")");
  pontos += incremento;
}

function saltar()
{
  console.log("saltar()");
  if (saltando)
    return;
  saltando = true;
  salto_ok = verifica_salto();
  if (salto_ok)
    saltou =  true;
  
  var pers_el = window.document.getElementById("personagem");
  pers_el.style.webkitAnimationPlayState = "running";
  pers_el.style.animationPlayState = "running";
}

function fim_do_salto()
{
  console.log("fim_do_salto()");
  if (salto_ok)
  {
    acrescenta_pontos(10+5*fase);
    atualiza_display_pontos();
  }

  saltando = false;
  salto_ok = false;

  var pers_el = window.document.getElementById("personagem");
  pers_el.style.webkitAnimationPlayState = "paused";
  pers_el.style.animationPlayState = "paused";

}

function colisao()
{
  console.log("colisao()");
  perde_energia(10);
  document.getElementById('mario_hurt').play();
}

function finaliza_jogo()
{
  console.log("finaliza_jogo()");
  atualiza_display_energia();
  alert("GAME OVER");

  inicio();
}

function verifica_salto()
{
  console.log("verifica_salto()");
  // se não iniciou animação não tem validade
  if (ts_inicio_anim_obs == 0)
    return false;

  // determina o intervalo de tempo decorrido (em ms) entre o tempo atual e o início da animação do obstáculo 
  var d = new Date();
  var intervalo = d.getTime()-ts_inicio_anim_obs;

  // calcula a distância do personagem até o obstáculo
  // var distancia = WIDTH_JANELA-Math.round(intervalo * vel_1o_plano / 1000);
  var distancia = document.getElementById('obstaculo1').getBoundingClientRect().left;
  console.log("transcorridos: "+intervalo+" ms! => distancia: "+distancia+ "pixels"); 
  
  // verifica se a distância entre o personagem e o obstáculo permite um salto OK!
  // (Obs: valores ajustados empiricamente!)
  if (distancia > 199 && distancia <= 260 )
  {    
    console.log("salto OK!"); 
    return true;
  }
  // está em uma distância em que haverá colisão
  else if (distancia > 260 && distancia <= 450) 
  {
    console.log("VAI BATER!!!");
    return false;
  }
  // se a distância muito grande é porque o salto foi feito antes da hora
  else if (distancia > 450)
  {
    console.log("salto ANTES da hora!"); 
    return false;
  }
  return false;
}

// function tem_obstaculo_para_saltar()
// {
//   console.log("tem_obstaculo_para_saltar()");
//   // TODO verifica se obstaculo está na distância correta para o salto
//   // se estiver retorna true e vai provocar pontuação
//   var tartaruga = document.getElementById('obstaculo1');
//   var distanciaLeft = tartaruga.getBoundingClientRect().left;
//   if(distanciaLeft > 200 && distanciaLeft < 260){
//     document.getElementById('mario_coin').play();
//     return true;
//   }
//   return false;
//   // TODO se estiver em distância de colisao -> chama função colisao()
  
// }