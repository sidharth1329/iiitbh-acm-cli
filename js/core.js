            var shell = new Object();
            shell.lib = new Object();
            shell.lib.namespace = function (C) {
                var D = C.split(".");
                var A = window;
                for (var B = 0; B < D.length; B++) {
                    if (typeof A[D[B]] == "undefined") {
                        A[D[B]] = new Object()
                    }
                    A = A[D[B]]
                }
            };
            shell.lib.in_array = function (A, C) {
                var B;
                for (B = 0; B < A.length; B++) {
                    if (A[B] == C) {
                        return true
                    }
                }
                return false
            };
            shell.lib.chop = function (A) {
                if (A) {
                    while (A.charAt(0) == " ") {
                        A = A.substr(1)
                    }
                }
                return A
            };
            shell.lib.namespace("shell.lib");
            shell.lib.get = function (A) {
                A = A.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var C = "[\\?&]" + A + "=([^&#]*)";
                var D = new RegExp(C);
                var B = D.exec(window.location.href);
                if (B == null) {
                    return ""
                } else {
                    return decodeURIComponent(B[1]).replace(/\+/g, " ")
                }
            };
            shell.lib.namespace("shell.lib.cookie");
            shell.lib.cookie.list = new Object();
            shell.lib.cookie.getfromstr = function (G, D) {
                var A = G.split(";");
                for (var C = 0; C < A.length; C++) {
                    var F = A[C].split("=");
                    var B = shell.lib.chop(F[0]);
                    var E = shell.lib.chop(F[1]);
                    if (D && shell.lib.cookie.list[B] != E) {
                        shell.lib.cookie.set(B, E, 365)
                    }
                    shell.lib.cookie.list[B] = E
                }
            };
            shell.lib.cookie.get = function (A) {
                return shell.lib.cookie.list[A]
            };
            shell.lib.cookie.set = function (B, D, F) {
                var E = new Date();
                var C = E.getTime() + (F * 24 * 60 * 60 * 1000);
                E.setTime(C);
                document.cookie = B + "=" + D + "; expires=" + E.toGMTString();
                if (shell.config.user != "guest" && B != "loggedin") {
                    var A = "";
                    if (F < 0) {
                        A = "&del=1"
                    }
                    shell.ajax.query("http://goosh.appspot.com/cookie?key=" + encodeURIComponent(B) + "&val=" + encodeURIComponent(D) + "&callback=shell.lib.cookie.fetch" + A, true)
                }
                shell.lib.cookie.list[B] = D;
                return D
            };
            shell.lib.cookie.del = function (A) {
                shell.lib.cookie.set(A, "", -100);
                shell.lib.cookie.list[A] = null
            };
            shell.lib.cookie.getall = function () {
                return shell.lib.cookie.list
            };
            shell.lib.namespace("shell.lang");
            shell.lang.list = {
                arabic: "ar",
                bulgarian: "bg",
                catalan: "ca",
                chinese: "zh",
                chinese_simplified: "zh-cn",
                chinese_traditional: "zh-tw",
                croatian: "hr",
                czech: "cs",
                danish: "da",
                dutch: "nl",
                english: "en",
                estonian: "et",
                filipino: "tl",
                finnish: "fi",
                french: "fr",
                german: "de",
                greek: "el",
                hebrew: "iw",
                hindi: "hi",
                hungarian: "hu",
                indonesian: "id",
                italian: "it",
                japanese: "ja",
                korean: "ko",
                latvian: "lv",
                lithuanian: "lt",
                norwegian: "no",
                persian: "fa",
                polish: "pl",
                portuguese: "pt",
                romanian: "ro",
                russian: "ru",
                serbian: "sr",
                slovak: "sk",
                slovenian: "sl",
                spanish: "es",
                swedish: "sv",
                thai: "th",
                turkish: "tr",
                ukrainian: "uk",
                vietnamese: "vi"
            };
            shell.lang.reverse = new Object();
            for (key in shell.lang.list) {
                shell.lang.reverse[shell.lang.list[key]] = key
            }
            shell.lib.namespace("shell.gui");
            shell.gui.inputel = false;
            shell.gui.outputel = false;
            shell.gui.promptel = false;
            shell.gui.inputfield = false;
            shell.gui.bodyel = false;
            shell.gui.el = function (A) {
                return document.getElementById(A)
            };
            shell.gui.init = function () {
                shell.gui.inputel = document.getElementById("input");
                shell.gui.outputel = document.getElementById("output");
                shell.gui.promptel = document.getElementById("prompt");
                shell.gui.inputfield = document.getElementById("inputfield");
                shell.gui.bodyel = document.getElementById("body");
                if (shell.gui.inputfield.createTextRange) {
                    shell.gui.inputfield.onkeyup = new Function("return shell.keyboard.mcursor(event);");
                    shell.gui.bodyel.onfocus = new Function("return shell.gui.focusinput(event);");
                    shell.gui.bodyel.onclick = new Function("return shell.gui.focusinput(event);");
                    shell.gui.bodyel.onkeydown = new Function("return shell.keyboard.keyDownHandler(event);")
                } else {
                    shell.gui.inputfield.onkeyup = shell.keyboard.mcursor;
                    shell.gui.bodyel.onfocus = shell.gui.focusinput;
                    shell.gui.bodyel.onclick = shell.gui.focusinput;
                    shell.gui.bodyel.onkeydown = shell.keyboard.keyDownHandler
                }
            };
            shell.gui.error = function (A) {
                shell.ajax.stopall();
                shell.gui.out("Error: " + A + "<br/> <br/>");
                shell.gui.showinput();
                shell.gui.focusinput();
                shell.gui.scroll()
            };
            shell.gui.outln = function (A) {
                shell.gui.out(A + "<br/>")
            };
            shell.gui.out = function (A) {
                var B = document.createElement("div");
                B.innerHTML = A;
                shell.gui.outputel.appendChild(B)
            };
            shell.gui.less = function (A) {
                return "<span class='less'>" + A + "</span>"
            };
            shell.gui.info = function (A) {
                return "<span class='info'>" + A + "</span>"
            };
            shell.gui.clear = function () {
                shell.gui.outputel.innerHTML = ""
            };
            shell.gui.showinput = function () {
                shell.gui.inputel.style.display = "block"
            };
            shell.gui.hideinput = function () {
                shell.gui.inputel.style.display = "none"
            };
            shell.gui.focusinput = function () {
                var A = "";
                if (document.selection) {
                    A = document.selection.createRange().text
                } else {
                    if (window.getSelection) {
                        A = window.getSelection().toString()
                    }
                }
                if (A.length == 0) {
                    document.f.q.value = document.f.q.value;
                    if (shell.gui.inputel.style.display != "none") {
                        document.f.q.focus()
                    }
                }
            };
            shell.gui.updateprompt = function () {
                shell.gui.prompt = shell.config.user + "@" + shell.config.host + ":80/" + shell.config.mode + shell.config.pend;
                shell.gui.promptel.innerHTML = shell.gui.prompt
            };
            shell.gui.scroll = function () {
                window.scrollBy(0, 122500)
            };
            shell.gui.setstyle = function (B, E, D) {
                try {
                    var A = shell.gui.el(B);
                    A.style[E] = D;
                    return true
                } catch (C) {
                    return false
                }
            };
            shell.gui.setstyleclass = function (D, B) {
                var C = document.createElement("div");
                var A = "<br style='line-height:0px;'/><style>" + D + " {" + B + "}</style>";
                C.innerHTML = A;
                shell.gui.bodyel.appendChild(C)
            };
            shell.lib.namespace("shell.set");
            shell.set.base = function (name, def, txt, min, max) {
                this.name = name;
                this.txt = txt;
                this.def = def;
                (max) ? this.max = max : this.max = 2000;
                (min) ? this.min = min : this.min = 0;
                if (min && max) {
                    this.txt += " (" + min + ".." + max + ")"
                }
                this.get = function () {
                    return eval("" + this.name + ";")
                };
                this.set = function (val) {
                    if (val >= this.min && val <= this.max) {
                        eval("" + this.name + " = '" + val + "';")
                    }
                    return true
                }
            };
            shell.set.list = new Object();
            shell.set.list.lang = new shell.set.base("shell.config.lang", "en", "google default language");
            shell.set.list.lang.set = function (A) {
                if (shell.lang.reverse[A]) {
                    shell.config.lang = A
                } else {
                    if (shell.lang.list[A]) {
                        shell.config.lang = shell.lang.list[A]
                    } else {
                        return false
                    }
                }
                return true
            };
            shell.set.list.results = new shell.set.base("shell.config.numres", "4", "number of results for google-searches", 1, 100);
            shell.set.list.timeout = new shell.set.base("shell.config.timeout", "4", "timeout for ajax requests in seconds", 1, 100);
            shell.set.list["style.bg"] = new shell.set.base("shell.config.bgcolor", "#000000", "shell background color");
            shell.set.list["style.bg"].set = function (A) {
                if (shell.gui.setstyle("body", "backgroundColor", A) && shell.gui.setstyle("inputfield", "backgroundColor", A)) {
                    shell.config.bgcolor = A;
                    return true
                } else {
                    return false
                }
            };
            shell.set.list["style.fg"] = new shell.set.base("shell.config.fgcolor", "#ffffff", "shell font color");
            shell.set.list["style.fg"].set = function (A) {
                if (shell.gui.setstyle("body", "color", A) && shell.gui.setstyle("inputfield", "color", A)) {
                    shell.config.fgcolor = A;
                    return true
                } else {
                    return false
                }
            };
            shell.set.list["style.hl"] = new shell.set.base("shell.config.hlcolor", "#009900", "shell highlight color");
            shell.set.list["style.hl"].set = function (A) {
                shell.gui.setstyleclass(".info", "color: " + A);
                shell.gui.setstyleclass("a:visited.info", "color: " + A);
                shell.config.hlcolor = A;
                return true
            };
            shell.set.list["style.sh"] = new shell.set.base("shell.config.shcolor", "#ffffff", "shell 'shaded' color");
            shell.set.list["style.sh"].set = function (A) {
                shell.gui.setstyleclass(".less", "color: " + A);
                shell.config.shcolor = A;
                return true
            };
            shell.set.list["style.link"] = new shell.set.base("shell.config.linkcolor", "#ffffff", "shell link color");
            shell.set.list["style.link"].set = function (A) {
                shell.gui.setstyleclass("a", "color: " + A);
                shell.config.linkcolor = A;
                return true
            };
            shell.set.list["style.vlink"] = new shell.set.base("shell.config.vlinkcolor", "#ffffff", "shell visited link color");
            shell.set.list["style.vlink"].set = function (A) {
                shell.gui.setstyleclass("a:visited", "color: " + A);
                shell.config.vlinkcolor = A;
                return true
            };
            shell.set.list["place.width"] = new shell.set.base("shell.config.mapwidth", "300", "width of map image", 20, 600);
            shell.set.list["place.height"] = new shell.set.base("shell.config.mapheight", "150", "height of map image", 20, 500);
            shell.set.init = function (A, C) {
                if (shell.config.user != "guest") {
                    if (!A) {
                        shell.ajax.query("http://goosh.appspot.com/cookie?callback=shell.set.init");
                        return
                    } else {
                        if (shell.ajax.iscontext(A)) {
                            shell.gui.outln("Loading remote settings...");
                            shell.lib.cookie.getfromstr(document.cookie);
                            shell.lib.cookie.getfromstr(C, true)
                        }
                    }
                } else {
                    shell.gui.outln("Loading local settings...");
                    shell.lib.cookie.getfromstr(document.cookie)
                }
                var B = shell.lib.cookie.getall();
                for (key in shell.set.list) {
                    var D = false;
                    if (B[key]) {
                        D = B[key]
                    }
                    if (D && shell.set.list[key].set(D)) {
                        shell.gui.outln("&nbsp;" + key + " => &quot;" + D + "&quot;.")
                    } else {
                        shell.set.list[key].set(shell.set.list[key].def)
                    }
                }
                shell.gui.outln("");
                shell.getquery()
            };
            shell.lib.namespace("shell.ajax");
            shell.ajax.contexts = new Array();
            shell.ajax.lastcontext = false;
            shell.ajax.stopall = function () {
                for (key in shell.ajax.contexts) {
                    shell.ajax.iscontext(key)
                }
            };
            shell.ajax.deletecontext = function (A) {
                shell.gui.outln("Error: Operation timed out. " + A);
                if (!document.all) {
                    shell.gui.outln(shell.gui.less('If you use the noscript firefox-extension, add "ajax.googleapis.com" to the whitelist.'))
                }
                shell.gui.outln("");
                shell.ajax.contexts[A] = false;
                var B = document.getElementById(A);
                if (B) {
                    document.body.removeChild(B)
                }
                shell.gui.showinput();
                shell.gui.focusinput();
                shell.gui.scroll();
                if (!document.all) {
                    stop()
                }
            };
            shell.ajax.iscontext = function (A) {
                if (shell.ajax.contexts[A]) {
                    clearTimeout(shell.ajax.contexts[A]);
                    shell.ajax.contexts[A] = false;
                    var B = document.getElementById(A);
                    if (B) {
                        document.body.removeChild(B)
                    }
                    return true
                } else {
                    return false
                }
            };
            shell.ajax.getcontext = function (A) {
                var C = new Date();
                var B = C.getTime();
                if (A) {
                    B = A
                }
                shell.ajax.contexts[B] = setTimeout("shell.ajax.deletecontext('" + B + "');", 1000 * shell.config.timeout);
                return B
            };
            shell.ajax.query = function (A, D) {
                var B = "none";
                if (!D) {
                    B = shell.ajax.getcontext();
                    shell.ajax.lastcontext = B;
                    shell.gui.hideinput()
                }
                var C = document.createElement("script");
                document.body.appendChild(C);
                C.src = A + "&context=" + B + "&";
                C.id = B
            };
            shell.lib.namespace("shell.config");
            shell.config.apikey = "ABQIAAAA0cXSEVCNSwf_x74KTtPJMRQP4Q7D8MPck7bhT7upyfJTzVDU2BRxkUdd2AvzlDDF7DNUJI_Y4eB6Ug";
            shell.config.user = "user";
            shell.config.host = "iiitbh-acm.org";
            shell.config.mode = "";
            shell.config.pend = "$&nbsp;";
            shell.config.numres = 4;
            shell.config.timeout = 4;
            shell.config.start = 0;
            shell.config.moreobj;
            shell.config.lang = "en";
            shell.config.urls = new Array();
            shell.config.cmdlines = new Array();
            shell.config.cmdqueue = new Array();
            shell.lib.namespace("shell.keyboard");
            shell.keyboard.suggestions = new Array();
            shell.keyboard.suggpos = 1;
            shell.keyboard.suggword = "";
            shell.keyboard.hist = new Array();
            shell.keyboard.histpos = 0;
            shell.keyboard.histtemp = 0;
            shell.keyboard.suggest = function (B) {
                if (shell.keyboard.suggpos > shell.keyboard.suggestions[B].length) {
                    shell.keyboard.suggpos = 1
                }
                if (shell.keyboard.suggestions[B][shell.keyboard.suggpos]) {
                    shell.gui.inputfield.value = shell.keyboard.suggestions[B][shell.keyboard.suggpos]
                }
                var C = shell.gui.inputfield;
                if (C.createTextRange) {
                    var A = C.createTextRange();
                    A.moveStart("character", B.length);
                    A.select()
                } else {
                    if (C.setSelectionRange) {
                        C.setSelectionRange(B.length, C.value.length)
                    }
                }
            };
            shell.keyboard.dummyac = function () {
                this.Suggest_apply = function (C, D, A, B) {
                    shell.keyboard.suggestions[D] = A;
                    shell.keyboard.suggest(D);
                    return true
                }
            };
            window.google = new Array();
            window.google.ac = new shell.keyboard.dummyac();
            shell.keyboard.keyDownHandler = function (B) {
                if (!B && window.event) {
                    B = window.event
                }
                if (B) {
                    _lastKeyCode = B.keyCode
                }
                if (B && B.keyCode == 9) {
                    B.cancelBubble = true;
                    B.returnValue = false;
                    var C = shell.keyboard.suggword;
                    if (C != "") {
                        if (!shell.keyboard.suggestions[C]) {
                            shell.keyboard.suggpos = 1;
                            var A = document.createElement("script");
                            document.body.appendChild(A);
                            A.src = "http://www.google.com/complete/search?hl=" + shell.config.lang + "&js=true&qu=" + encodeURIComponent(C)
                        } else {
                            shell.keyboard.suggpos += 2;
                            shell.keyboard.suggest(C)
                        }
                    }
                    return false
                }
            };
            shell.keyboard.mcursor = function (B) {
                var A = B.keyCode;
                if (shell.keyboard.hist.length > 0) {
                    if (A == 38 || A == 40) {
                        if (shell.keyboard.hist[shell.keyboard.histpos]) {
                            shell.keyboard.hist[shell.keyboard.histpos] = shell.gui.inputfield.value
                        } else {
                            shell.keyboard.histtemp = shell.gui.inputfield.value
                        }
                    }
                    if (A == 38) {
                        shell.keyboard.histpos--;
                        if (shell.keyboard.histpos < 0) {
                            shell.keyboard.histpos = 0
                        }
                    } else {
                        if (A == 40) {
                            shell.keyboard.histpos++;
                            if (shell.keyboard.histpos > shell.keyboard.hist.length) {
                                shell.keyboard.histpos = shell.keyboard.hist.length
                            }
                        }
                    }
                    if (A == 38 || A == 40) {
                        if (shell.keyboard.hist[shell.keyboard.histpos]) {
                            shell.gui.inputfield.value = shell.keyboard.hist[shell.keyboard.histpos]
                        } else {
                            shell.gui.inputfield.value = shell.keyboard.histtemp
                        }
                    }
                }
                if (A != 9 && A != 13) {
                    shell.keyboard.suggword = shell.gui.inputfield.value
                }
                if (A == 13) {
                    shell.command()
                }
            };
            shell.lib.namespace("shell.modules");
            shell.lib.namespace("shell.module");
            shell.lib.namespace("shell.modobj");
            shell.modules.list = new Array();
            shell.module.base = function () {
                this.mode = false;
                this.parameters = "";
                this.help = "no helptext yet.";
                this.helptext = "";
                this.hasmore = false;
                this.results = new Array()
            };
            shell.modules.register = function (name, base) {
                if (!base) {
                    base = "base"
                }
                eval("shell.module." + name + ".prototype = new shell.module." + base + ";shell.modobj." + name + " = new shell.module." + name + ';shell.modules.list["' + name + '"] = shell.modobj.' + name + ";")
            };
