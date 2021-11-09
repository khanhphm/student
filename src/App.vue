<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      

      <v-spacer></v-spacer>
      <v-tabs
          dark
        >
          <v-tab to="/">
            Student Manager
          </v-tab>
          <v-tab to="/qr">
            Check QR
          </v-tab>
          <v-tab to="/rfid">
            Check RFID
          </v-tab>
        </v-tabs>
      
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
