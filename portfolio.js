(function(){
  var root = document.documentElement;
  var toggleBtn = document.getElementById('theme-toggle');
  var icon = document.getElementById('theme-icon');

  function getStored(){
    try{
      return window.localStorage.getItem('svello-theme');
    }catch(e){
      return null;
    }
  }
  function setStored(value){
    try{
      window.localStorage.setItem('svello-theme', value);
    }catch(e){
      /* storage unavailable — theme just won't persist */
    }
  }
  function systemPrefersDark(){
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function applyTheme(theme){
    if(theme === 'light'){
      root.setAttribute('data-theme','light');
      icon.textContent = '☀';
    } else {
      root.setAttribute('data-theme','dark');
      icon.textContent = '☾';
    }
  }

  var stored = getStored();
  var initial = stored || (systemPrefersDark() ? 'dark' : 'light');
  applyTheme(initial);

  toggleBtn.addEventListener('click', function(){
    var current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setStored(next);
  });
})();