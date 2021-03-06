// ==UserScript==
// @name        JVC SpawnKill
// @description JVC SpawnKill est un plugin pour jeuxvideo.com ajoutant des fonctionnalités comme les avatars, les citations ou les signatures.        
// @author      Spixel_
// @namespace   http://www.spixel.fr
// @include     http://*.jeuxvideo.com*
// @version     1.9
// @require     jquery-1.11.1.min.js?v1.9
// @require     jquery-plugins.js?v1.9
// @require     base.js?v1.9
// @require     Util.js?v1.9
// @require     Message.js?v1.9
// @require     Author.js?v1.9
// @require     Button.js?v1.9
// @require     SlideToggle.js?v1.9
// @require     Modal.js?v1.9
// @require     modules/Module.js?v1.9
// @require     modules/StartSpawnKill.js?v1.9
// @require     modules/Settings.js?v1.9
// @require     modules/QuickResponse.js?v1.9
// @require     modules/Quote.js?v1.9
// @require     modules/Shortcuts.js?v1.9
// @require     modules/InfosPseudo.js?v1.9
// @require     modules/HilightNewTopic.js?v1.9
// @require     modules/LastPage.js?v1.9
// @require     modules/EmbedMedia.js?v1.9
// @resource    banImage    images/ban.png
// @resource    newTopic    images/topic_new.gif
// @resource    carton      images/carton.png
// @resource    bronze      images/bronze.png
// @resource    argent      images/argent.png
// @resource    or          images/or.png
// @resource    rubis       images/rubis.png
// @resource    emeraude    images/emeraude.png
// @resource    diamant     images/diamant.png
// @resource    saphir      images/saphir.png
// @resource    female      images/female.png
// @resource    male        images/male.png
// @resource    unknown     images/unknown.png
// @resource    plus        images/plus.png
// @resource    minus       images/minus.png
// @resource    link        images/link.png
// @resource    quote       images/quote.png
// @resource    mp          images/mp.png
// @resource    alert       images/alert.png
// @resource    link-gray   images/link-gray.png
// @resource    calendar    images/calendar.png
// @resource    clock       images/clock.png
// @resource    settings    images/settings.png
// @resource    youtube     images/youtube.png
// @resource    vimeo       images/vimeo.png
// @resource    dailymotion images/dailymotion.png
// @resource    sondageio   images/sondageio.png
// @resource    image       images/image.png
// @resource    vocaroo     images/vocaroo.png
// @resource    loader      images/loader.gif
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceURL
// @grant       GM_setClipboard
// @run-at document-start
// ==/UserScript==

"use strict";
/* jshint unused: false */
/* jshint multistr: true */
/* jshint newcap: false */

//Permet de débugger sans GreaseMonkey
if($.isNotFunction(GM_xmlhttpRequest)) {
    var debug = true;
}

var modulesStyle = "";

//On charge seulement les modules nécessaires
for(var key in SK.moduleConstructors) {

    var moduleName = key;
    var module = new SK.moduleConstructors[key]();
    var moduleSettings = SK.Util.getValue(moduleName);
    //On prépare le chargement du module
    SK.modules[moduleName] = module;

    //On récupère les préférences courantes des options du module
    for(var settingKey in module.settings) {
        var setting = module.settings[settingKey];
        var settingLabel = settingKey;
        var settingValue = SK.Util.getValue(moduleName + "." + settingLabel);

        //Si la préférence n'est pas enregistrée, on prend la valeur par défaut
        if(settingValue === null) {
            settingValue = setting.default;
        }

        //On enregistre la préférence dans le module
        setting.value = settingValue;
    }

    //Si le module est requis, qu'il n'y a pas de préférences ou que la préférence est à faux
    if(module.required || moduleSettings === null || moduleSettings) {

        //On charge le CSS du module
        modulesStyle += module.internal_getCss();

        //On indique que le module est chargé
        module.activated = true;
    }
    else {
        module.activated = false;
    }

}

//On ajoute le style de tous les modules actifs
SK.Util.addCss(modulesStyle);


//document.ready ne fonctionne pas sur GM.
//Pour vérifier que le DOM est chargé, on vérifie que le footer est présent.
var checkDomReady = setInterval(function() {

    var initModule = function(module) {
        module.internal_init();
    };

    if($("#footer").length > 0) {

        clearInterval(checkDomReady);
        
        //On initialise les modules actifs
        for(var key in SK.modules) {
            if(SK.modules[key].activated) {
                initModule(SK.modules[key]);
            }
        }
    }

}, 50);
