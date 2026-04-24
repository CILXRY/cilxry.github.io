<div class="form-control">
  <input class="input input-alt" placeholder="搜索文章标题或描述..." type="text" id="blog-search">
  <span class="input-border input-border-alt"></span>
</div>

<style>
  .input {
    color: var(--text-color, #333);
    font-size: 0.9rem;
    background-color: var(--input-bg, #f9fafb);
    width: 100%;
    box-sizing: border-box;
    padding-inline: 0.5em;
    padding-block: 0.7em;
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 0.5rem;
  }

  .input-border {
    position: absolute;
    background: var(--border-after-color);
    width: 0%;
    height: 2px;
    bottom: 0;
    left: 0;
    transition: width 0.3s cubic-bezier(0.6, -0.28, 0.735, 0.045);
  }

  .input:focus {
    outline: none;
  }

  .input:focus + .input-border {
    width: 100%;
  }

  .form-control {
    position: relative;
    width: 100%;
  }

  .input-alt {
    font-size: 1rem;
    padding-inline: 1em;
    padding-block: 0.8em;
  }

  .input-border-alt {
    height: 3px;
    background: linear-gradient(90deg, #FF6464 0%, #FFBF59 50%, #47C9FF 100%);
    transition: width 0.4s cubic-bezier(0.42, 0, 0.58, 1.00);
  }

  .input-alt:focus + .input-border-alt {
    width: 100%;
  }

  /* 浅色模式 */
  :root:not(.dark) .input {
    --text-color: #374151;
    --input-bg: #f9fafb;
    --border-color: #e5e7eb;
  }

  /* 深色模式 */
  :root.dark .input {
    --text-color: #f3f4f6;
    --input-bg: #1f2937;
    --border-color: #374151;
  }
</style>
