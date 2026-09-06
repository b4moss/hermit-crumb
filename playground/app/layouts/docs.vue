<template>
  <div class="site-shell">
    <SiteHeader />
    <div class="site-body">
      <DocsSidebar />
      <div class="site-content">
        <div class="docs-content-row">
          <main class="site-main">
            <slot />
          </main>
          <DocsToc />
        </div>
        <SiteFooter />
      </div>
    </div>
  </div>
</template>
