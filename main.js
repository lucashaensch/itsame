var fase;
var energia;
var pontos;
var nobstaculos;
var saltando;
var saltando_obstaculo;
var conta_obstaculos;
var vel_fundo;
var vel_1o_plano;

var flag_mudou_fase;

var WIDTH_PLANO_DE_FUNDO = 3180;  // nÃºmero de pixels da largura da imagem
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
  nobstaculos = 3;
  
  vel_fundo = 50;
  vel_1o_plano = 400;
  
  limpa_displays();
  seta_listeners();

  inicia_fase();
}

function inicia_fase()
{
  console.log("inicia_fase("+fase+")");

  saltando = false;
  saltando_obstaculo = false;
  conta_obstaculos = 0;

  calcula_tempos();
  flag_mudou_fase = false;
}

function seta_listeners()
{
  console.log("seta_listeners");
  
  var pers_el = window.document.getElementById("personagem");
  pers_el.addEventListener("webkitAnimationIteration", fim_do_salto);
  pers_el.addEventListener("mozAnimationIteration", fim_do_salto);
  pers_el.addEventListener("animationIteration", fim_do_salto);
  pers_el.focus();

  var obstaculo_el = window.document.getElementById("obstaculo1");
  obstaculo_el.addEventListener("webkitAnimationIteration", conta_iteracao);
  obstaculo_el.addEventListener("mozAnimationIteration", conta_iteracao);
  obstaculo_el.addEventListener("animationIteration", conta_iteracao);

}

function conta_iteracao()
{
  conta_obstaculos++;
  console.log("conta_iteracao() - "+conta_obstaculos);
  verifica_mudanca_de_fase();
}

function verifica_mudanca_de_fase()
{
  console.log("verifica_mudanca_de_fase() => "+(conta_obstaculos)+" >= "+nobstaculos);
  if (conta_obstaculos >= nobstaculos)
  {
    var pers_el = window.document.getElementById("personagem");
    if (pers_el.style.animationPlayState == "running" ||
        pers_el.style.webkitAnimationPlayState == "running" ||
        pers_el.style.mozAnimationPlayState == "running")
      flag_mudou_fase=true;
    else
      muda_fase();
  }
}

function muda_fase()
{
  console.log("muda_fase()");
  
  ganha_energia(20);
  atualiza_display_energia();
  
  acrescenta_pontos(100+50*fase);
  atualiza_display_pontos();

  fase++;
  nobstaculos += 1;
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
  el_plano2.style.webkitAnimationDuration = tempo_animacao_fundo+"s";
  el_plano2.style.mozAnimationDuration = tempo_animacao_fundo+"s";
  el_plano2.style.animationDuration = tempo_animacao_fundo+"s";
  console.log("Tempo plano de fundo:"+tempo_animacao_fundo);

  var tempo_animacao_1o_plano = Math.round(1000*(WIDTH_JANELA+80) / vel_1o_plano);
  var el_obs = window.document.getElementById("obstaculo1");
  el_obs.style.webkitAnimationDuration = tempo_animacao_1o_plano+"ms";
  el_obs.style.mozAnimationDuration = tempo_animacao_1o_plano+"ms";
  el_obs.style.animationDuration = tempo_animacao_1o_plano+"ms";
  console.log("Tempo 1o plano:"+tempo_animacao_1o_plano);

  var tempo_animacao_personagem = Math.round(tempo_animacao_1o_plano / 3);
  var el_pers = window.document.getElementById("personagem");
  el_pers.style.webkitAnimationDuration = tempo_animacao_personagem+"ms";
  el_pers.style.mozAnimationDuration = tempo_animacao_personagem+"ms";
  el_pers.style.animationDuration = tempo_animacao_personagem+"ms";
  el_pers.style.webkitAnimationPlayState = "paused";
  el_pers.style.mozAnimationPlayState = "paused";
  el_pers.style.animationPlayState = "paused";
  console.log("Tempo personagem:"+tempo_animacao_personagem);

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
  if (energia > 0)
    atualiza_display_energia();
  if (energia < 0)
    energia = 0;
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
  saltando_obstaculo = tem_obstaculo_para_saltar();
  
  var pers_el = window.document.getElementById("personagem");
  pers_el.style.webkitAnimationPlayState = "running";
  pers_el.style.mozAnimationPlayState = "running";
  pers_el.style.animationPlayState = "running";
}

function fim_do_salto()
{
  console.log("fim_do_salto()");
  if (saltando_obstaculo)
  {
    acrescenta_pontos(10+5*fase);
    atualiza_display_pontos();
  } else {
    colisao();
  }
  saltando = false;
  saltando_obstaculo = false;
  var pers_el = window.document.getElementById("personagem");
  pers_el.style.webkitAnimationPlayState = "paused";
  pers_el.style.mozAnimationPlayState = "paused";
  pers_el.style.animationPlayState = "paused";

  if (flag_mudou_fase)
    muda_fase();
}

function colisao()
{
  console.log("colisao()");
  perde_energia(10);
  document.getElementById('mario_hurt').play();
  saltando = false;
  saltando_obstaculo = false;
}

function finaliza_jogo()
{
  console.log("finaliza_jogo()");
  alert("GAME OVER");
}

function tem_obstaculo_para_saltar()
{
  console.log("tem_obstaculo_para_saltar()");
  // TODO verifica se obstaculo está na distância correta para o salto
  // se estiver retorna true e vai provocar pontuação
  var tartaruga = document.getElementById('obstaculo1');
  var distanciaLeft = tartaruga.getBoundingClientRect().left;
  if(distanciaLeft > 200 && distanciaLeft < 260){
    document.getElementById('mario_coin').play();
    return true;
  }
  return false;
  // TODO se estiver em distância de colisao -> chama função colisao()
  
}