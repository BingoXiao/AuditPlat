import Vue from "vue"
import VueResource from "vue-resource"
import alasql from "alasql"
Vue.use(VueResource)

function UserAccount_Filter(url, name) {
  this.url = url
  this.name = name
  this.data = null
  this.loadData = function () {
    var self = this
    Vue.http.get(self.url + "?name=" + name).then(function(response) {
      if (response.body.success) {
        self.data = data.content
      }
    })
  }
  this.gainSummary = function() {
    this.filtration_account = alasql('SELECT * FROM ? WHERE "name" LIKE %?%', [this.data, this.name])
    return {"name": this.filtration_account}
  }
}



module.exports = {
  UserAccount_Filter
}
