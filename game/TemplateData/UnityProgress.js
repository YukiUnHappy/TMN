function UnityProgress(gameInstance, progress) {
  if (!gameInstance.Module) {
    return;
  }
  if (!gameInstance.logo) {
    gameInstance.logo = document.createElement("div");
    gameInstance.logo.className = "logo " + gameInstance.Module.splashScreenStyle;
    gameInstance.container.appendChild(gameInstance.logo);
  }
  if (!gameInstance.progress) {    
    gameInstance.progress = document.createElement("div");
    gameInstance.progress.className = "progress " + gameInstance.Module.splashScreenStyle;
    gameInstance.progress.chara = document.createElement("div");
    gameInstance.progress.chara.className = "chara";
    gameInstance.progress.appendChild(gameInstance.progress.chara);
    gameInstance.progress.empty = document.createElement("div");
    gameInstance.progress.empty.className = "empty";
    gameInstance.progress.appendChild(gameInstance.progress.empty);
    gameInstance.progress.full = document.createElement("div");
    gameInstance.progress.full.className = "full";
    gameInstance.progress.appendChild(gameInstance.progress.full);
    gameInstance.progress.loading = document.createElement("div");
    gameInstance.progress.loading.className = "loading";
    gameInstance.progress.loading2 = document.createElement("div");
    gameInstance.progress.loading2.className = "loading2";
    gameInstance.progress.appendChild(gameInstance.progress.loading);
    gameInstance.progress.appendChild(gameInstance.progress.loading2);
    gameInstance.container.appendChild(gameInstance.progress);
    
    // デバッグ用のローディング時間表示用
    debugTime = new Date().getTime();
  }
  gameInstance.progress.full.style.width = (100 * progress) + "%";
  gameInstance.progress.empty.style.width = (100 * (1 - progress)) + "%";
  
  // デバッグ用のローディング時間更新
  var elapsed = new Date().getTime() - debugTime;
  var elapsedSec = elapsed / 1000;
  document.getElementById("debug-timer").innerText = ("      " + elapsedSec.toFixed(1)).slice(-6) + " sec";
  
  if (progress == 1) {
    gameInstance.logo.style.display = gameInstance.progress.style.display = "none";
    document.getElementById("debug-timer").style.display="none";
  }
}

var debugTime = 0;