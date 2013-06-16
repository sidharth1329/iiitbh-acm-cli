shell.module.clear = function () {
                this.name = "clear";
                this.aliases = new Array("clear", "c");
                this.help = "clear the screen";
                this.call = function (A) {
                    shell.gui.clear()
                }
            };
            shell.modules.register("clear");

		shell.module.posts = function () {
                this.name = "posts";
                this.aliases = new Array("posts");
                this.mode = true;
                this.help = "A directory containing website posts as text files";
                this.helptext = "<span class='info'>examples:</span><br/><i>cd posts</i>  - Changes the directory to posts, where you can use 'ls' to list all the website posts..<br/>"
            };
            shell.modules.register("posts");

            shell.module.help = function () {
                this.name = "help";
                this.aliases = new Array("help", "man", "h", "?");
                this.help = "displays help text";
                this.helptext = "";
                this.parameters = "[command]";
                this.call = function (C) {
                    if (C[0] == "shell") {
                        C[0] = false
                    }
                    var B = "<span class='info'>help";
                    if (C[0]) {
                        B += ": " + C[0]
                    }
                    B += "</span><br/> <br/>";
                    if (C[0] && !shell.modules.list[C[0]]) {
                        shell.gui.error("command &quot;" + C[0] + "&quot; not found.");
                        return false
                    }
                    B += "<table border='0' class='help'>";
                    B += "<tr><td class='less'>command</td><td class='less'>aliases</td><td class='less'>parameters</td><td class='less'>function</td></tr>";
                    var A;
                    for (key in shell.modules.list) {
                        if (!C[0] || key == C[0]) {
                            A = shell.modules.list[key];
                            B += "<tr><td";
                            if (A.mode) {
                                B += " class='info'"
                            }
                            B += ">";
                            B += "" + A.name + "</td><td>";
                            if (A.aliases.length > 1) {
                                B += "(";
                                for (i = 0; i < A.aliases.length; i++) {
                                    if (A.aliases[i] != A.name) {
                                        B += A.aliases[i];
                                        B += ","
                                    }
                                }
                                B = B.substr(0, B.length - 1);
                                B += ")"
                            }
                            B += "</td><td>";
                            if (A.parameters) {
                                B += A.parameters
                            }
                            B += "</td><td>";
                            B += "" + A.help + "\n";
                            B += "</td></tr>"
                        }
                    }
                    B += "</table>";
                    if (C[0]) {
                        B += " <br/>";
                        B += A.helptext;
                        B += " <br/>"
                    } else {
                        B += " <br/>";
                        B += "- Enter green commands without parameters to change default mode.<br/>";
                        B += "- Anything that's not a command will stay on the standard input without any error.<br/>";
                        B += "- Aliases will expand to commands. Numbers will expand to corresponding search results.<br/>";
                        B += "- Use cursor up and down for command history.<br/>";
                        B += "- Enter keyword and hit the tab-key for tab-completion.<br/>";
                        B += "- Commands marked with * are experimental, use them with care and please report any bugs.<br/>";
                        B += "<br/>"
                    }
                    shell.gui.outln(B)
                }
            };
            shell.modules.register("help");
            shell.module.cd = function () {
                this.name = "cd";
                this.aliases = new Array("cd");
                this.parameters = "&lt;command>";
                this.help = "Change directory";
                this.helptext = "This exists just for convenience. Use &lt;command> without parameters instead.<br/>";
                this.call = function (A) {
                    if (!A[0]) {
                        A[0] = shell.config.mode;
                    }
                    if (A[0] && A[0] == "..") {
                        shell.config.mode = "";
			shell.gui.updateprompt();
			return;
                    }
                    if (A[0] && shell.modules.list[A[0]] && shell.modules.list[A[0]].mode) {
                        var B = shell.modules.list[A[0]];
                        shell.config.mode = B.name;
                        shell.gui.updateprompt();
                    } else {
                        shell.gui.error("command not found or command is not a mode.");
                    }
                }
            };
            shell.modules.register("cd");
			
			function loadXMLDoc(file){
				var xmlhttp;
				if (window.XMLHttpRequest){
					// code for IE7+, Firefox, Chrome, Opera, Safari
					xmlhttp=new XMLHttpRequest();
				}
				else{
					// code for IE6, IE5
					xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
				}
				xmlhttp.onreadystatechange=function(){
					switch(xmlhttp.readyState){
						case 4:		if(xmlhttp.status==200){
										var text = xmlhttp.responseText;
										shell.gui.outln('<div style="color:cyan"><pre>'+text+'</pre></div>');
										break;
									}
						case 404:	shell.gui.error("File not found.")
									break;					
					}
				}
				xmlhttp.open("GET","./text/"+file,true);
				xmlhttp.send(null);
			}
			shell.module.cat = function () {
                this.name = "cat";
                this.aliases = new Array("cat", "pr");
                this.parameters = "&lt;command>";
                this.help = "UNIX text viewer";
                this.helptext = "This exists just for convenience. Use &lt;command> without parameters instead.<br/>";
                this.call = function (A) {
					loadXMLDoc(A[0]);					
                }
            };
            shell.modules.register("cat");

 		shell.module.startx = function (){
                this.name = "startx";
                this.aliases = new Array("startx", "x");
                this.parameters = "[command]";
                this.help = "Open X Windows System";
                this.call = function (args){
					window.location.href = "http://gui.iiitbh-acm.org";
				}
        };
            shell.modules.register("startx");
			
		shell.module.pwd = function (){
                this.name = "pwd";
                this.aliases = new Array("pwd");
                this.parameters = "[command]";
                this.help = "Displays the present working directory";
                this.call = function (args){
					shell.gui.outln("/usr/etc/home/"+shell.config.mode);
				}
        };
        shell.modules.register("pwd");
			
		shell.module.who = function (){
			this.name = "who";
			this.aliases = new Array("who", "whoami", "who am i");
			this.parameters = "[command]";
			this.help = "Displays user details";
			this.call = function (args){
				var BrowserDetect = {
					init: function () {
						this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
						this.version = this.searchVersion(navigator.userAgent)
						|| this.searchVersion(navigator.appVersion)
						|| "an unknown version";
						this.OS = this.searchString(this.dataOS) || "an unknown OS";
					},
					searchString: function (data) {
						for (var i=0;i<data.length;i++)	{
							var dataString = data[i].string;
							var dataProp = data[i].prop;
							this.versionSearchString = data[i].versionSearch || data[i].identity;
							if (dataString) {
								if (dataString.indexOf(data[i].subString) != -1)
									return data[i].identity;
							}
							else if (dataProp)
								return data[i].identity;
						}
					},
					searchVersion: function (dataString) {
						var index = dataString.indexOf(this.versionSearchString);
						if (index == -1) return;
						return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
					},
					dataBrowser: [
						{
							string: navigator.userAgent,
							subString: "Chrome",
							identity: "Chrome"
						},
						{ 	string: navigator.userAgent,
							subString: "OmniWeb",
							versionSearch: "OmniWeb/",
							identity: "OmniWeb"
						},
						{
							string: navigator.vendor,
							subString: "Apple",
							identity: "Safari",
							versionSearch: "Version"
						},
						{
							prop: window.opera,
							identity: "Opera",
							versionSearch: "Version"
						},
						{
							string: navigator.vendor,
							subString: "iCab",
							identity: "iCab"
						},
						{
							string: navigator.vendor,
							subString: "KDE",
							identity: "Konqueror"
						},
						{
							string: navigator.userAgent,
							subString: "Firefox",
							identity: "Firefox"
						},
						{
							string: navigator.vendor,
							subString: "Camino",
							identity: "Camino"
						},
						{		// for newer Netscapes (6+)
							string: navigator.userAgent,
							subString: "Netscape",
							identity: "Netscape"
						},
						{
							string: navigator.userAgent,
							subString: "MSIE",
							identity: "Explorer",
							versionSearch: "MSIE"
						},
						{
							string: navigator.userAgent,
							subString: "Gecko",
							identity: "Mozilla",
							versionSearch: "rv"
						},
						{ 		// for older Netscapes (4-)
							string: navigator.userAgent,
							subString: "Mozilla",
							identity: "Netscape",
							versionSearch: "Mozilla"
						}
				],
				dataOS : [
					{
						string: navigator.platform,
						subString: "Win",
						identity: "Windows"
					},
					{
						string: navigator.platform,
						subString: "Mac",
						identity: "Mac"
					},
					{
						   string: navigator.userAgent,
						   subString: "iPhone",
						   identity: "iPhone/iPod"
					},
					{
						string: navigator.platform,
						subString: "Linux",
						identity: "Linux"
					}
				]

			};
			BrowserDetect.init();
			shell.gui.outln("Browser name: "+BrowserDetect.browser+"<br>Browser version: "+BrowserDetect.version+"<br>Operating System: "+BrowserDetect.OS+"<br>");
			}
        };
        shell.modules.register("who");
		
            shell.module.ls = function () {
                this.name = "ls";
                this.aliases = new Array("ls");
                this.help = "lists commands";
                this.helptext = "this exists just for convenience. Use <span class='info'>help</span> for help.<br/>";
                this.parameters = "[command]";
                this.call = function (C) {
                    var B = "";
                    if (C[0] && !shell.modules.list[C[0]]) {
                        shell.gui.error("command &quot;" + C[0] + "&quot; not found.");
                        return false
                    }
                    B += "<table border='0' class='help'><tr>";
                    var A;
                    var D = 0;
			
		    if(shell.config.mode == "posts"){
		    B+="<td class='txt_file'>ACM_Officer_Elections_2012.txt</td>";
		    }
		    else{
                    for (key in shell.modules.list) {
					
                        if (C.length == 0 || key == C[0]) {
                            A = shell.modules.list[key];
                            B += "<td";
                            if (A.mode) {
                                B += " class='info'"
                            }
							else if((A.name).search('.txt')!=-1){
								B += " class='txt_file'";
							}
                            B += ">" + A.name + "</td><td>";
                            if (D == 5) {
                                D = 0;
                                B += "</tr><tr>"
                            }
                            D++
                        }
                    }}
                    B += "</tr></table>";
                    shell.gui.outln(B)
                }
            };
            shell.modules.register("ls");

            shell.module.load = function () {
                this.name = "load";
                this.aliases = new Array("load");
                this.help = "load an extension";
                this.parameters = "&lt;extension_url>";
                this.call = function (B) {
                    if (B[0]) {
                        var A = B[0];
                        if (A.indexOf("http://") == -1 && A.indexOf("https://")) {
                            A = "http://shell.org/ext/" + A + ".js"
                        }
                        var C = document.createElement("script");
                        document.body.appendChild(C);
                        C.src = A
                    }
                }
            };
            shell.modules.register("load");
            shell.module.calculate = function () {
                this.name = "calculate";
                this.aliases = new Array("calculate", "calc");
                this.help = "evaluate a mathematical expression";
                this.parameters = "[mathematical expression]";
                this.call = function (args) {
                    var out = "";
                    var exp = args.join(" ");
                    var expin = exp;
                    if (exp.match(/^[0-9\+\-\/\*\. \^\(\)]+$/)) {
                        exp = exp.replace(/([0-9]+)\^([0-9]+)/g, "Math.pow($1,$2)");
                        shell.gui.outln(expin + " = " + eval(exp))
                    } else {
                        shell.gui.error("could not calculate that.");
                        return false
                    }
                }
            };
            shell.modules.register("calculate");
            shell.module.settings = function () {
                this.name = "settings";
                this.aliases = new Array("settings", "set");
                this.help = "edit settings";
                this.parameters = "[name] [value]";
                this.helptext = "<span class='info'>examples:</span><br/><i>set lang de</i>  - sets language to german<br/><i>set lang</i>  - displays value of lang-setting<br/><i>settings</i>  - displays all settings<br/><i>settings reset</i>  - reset all settings to default values<br/>";
                this.call = function (B) {
                    var A = "";
                    if (B[0] && B[1]) {
                        if (shell.set.list[B[0]] && shell.set.list[B[0]].set(B[1])) {
                            if (shell.set.list[B[0]].get() == shell.set.list[B[0]].def) {
                                shell.lib.cookie.del(B[0])
                            } else {
                                shell.lib.cookie.set(B[0], shell.set.list[B[0]].get(), 365)
                            }
                            B[1] = false
                        } else {
                            shell.gui.error("Could not set " + B[0] + " to &quot;" + B[1] + "&quot;");
                            return false
                        }
                    }
                    if (B[0] && !B[1]) {
                        if (B[0] == "reset") {
                            for (key in shell.set.list) {
                                shell.set.list[key].set(shell.set.list[key].def);
                                shell.lib.cookie.del(key)
                            }
                            A += "Settings where set to default values."
                        } else {
                            if (shell.set.list[B[0]]) {
                                A += B[0] + " is set to &quot;" + shell.set.list[B[0]].get() + "&quot;.<br>"
                            } else {
                                shell.gui.error("No setting with that name.")
                            }
                        }
                    } else {
                        A += "<table border='0' class='help'><tr>";
                        A += "<tr><td class='less'>name</td><td class='less'>value</td><td class='less'>default</td><td class='less'>help</td></tr>";
                        for (key in shell.set.list) {
                            A += "<td";
                            A += " class='info'";
                            A += ">" + key + "</td>";
                            A += "<td>" + shell.set.list[key].get() + "</td>";
                            A += "<td class='less'>" + shell.set.list[key].def + "</td>";
                            A += "<td class='less'>" + shell.set.list[key].txt + "</td>";
                            A += "</tr><tr>"
                        }
                        A += "</tr></table>"
                    }
                    shell.gui.outln(A)
                }
            };
            shell.modules.register("settings");
			
			shell.module.about = function () {
				this.name = "about.txt";
				this.aliases = new Array("about.txt");
				this.help = "Text file containing information about the Chapter. Use with 'cat command'.";
			};
			shell.modules.register("about");
			
			shell.module.notices = function () {
				this.name = "notices.txt";
				this.aliases = new Array("notices.txt");
				this.help = "Text file containing notices and announcements of the Chapter. Use with 'cat command'.";
			};
			shell.modules.register("notices");

			shell.module.members = function () {
				this.name = "members.txt";
				this.aliases = new Array("members.txt");
				this.help = "Text file containing names and contacts of current officers and all other members of our ACM Student Chapter. Use with 'cat command'.";
			};
			shell.modules.register("members");			
