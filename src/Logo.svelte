<div class="logo-container">
  <h1>
    <a href="#top">
      <img
        src="Full_Wordmark_White.svg"
        alt="Elegant Skeleton"
        width="160.25"
        height="170"
      />
    </a>
  </h1>
  <div class="title-group">
    <h2>Public Aptitude Challenge</h2>
    <h4><a href="https://discord.gg/g5Yhybq6G9">join the discord</a></h4>
  </div>
</div>

<style lang="scss">
  @import './styles/constants';
  .logo-container {
    display: grid;
    grid-template-columns: 200px 1fr;
    align-items: center;
  }
  h1,
  h2 {
    text-align: left;
  }

  h1 {
    font-size: 28px;
    float: left;
  }

  h2 {
    font-size: 20px;
    margin: 0;
  }

  h4 {
    font-size: 15px;
    margin: 0;
    color:$dark-accent-color;
  }
  .title-group {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    gap: 10px;
  }
</style>
