<template>
  <div>
    <section class="hero is-medium is-primary is-bold">
      <div class="hero-body">
        <div class="container">
          <img alt="phoenix logo" src="../assets/logo.png" />
        </div>
      </div>
    </section>
    <section class="section columns has-text-light">
      <div class="column is-4 is-offset-4">
        <h1 class="is-size-3 has-text-centered">Log-in to your account</h1>
        <b-field label="Email" type="is-danger" message="This email is invalid">
          <b-input type="email" placeholder="Email Address"></b-input>
        </b-field>
        <b-field label="Password">
          <b-input type="password" value="" password-reveal></b-input>
        </b-field>
        <b-button type="is-primary" expanded>Login</b-button>
      </div>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: "Home",
  components: {}
};
</script>
<style lang="scss">

body,
html {
  background: #232323;
  height: 100%;
}
</style>