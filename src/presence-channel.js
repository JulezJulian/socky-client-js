Socky.PresenceChannel = Socky.PrivateChannel.extend({

  init: function(channel_name, socky, options) {
    this._super(channel_name, socky, options);
    this._members = {};
    this._subscription_data = JSON.stringify(options['data']);
    this.raw_event_bind('socky:member:added', Socky.Utils.bind(this.on_member_added, this));
    this.raw_event_bind('socky:member:removed', Socky.Utils.bind(this.on_member_removed, this));
  },

  disconnect: function(){
    this._members = {};
  },

  is_presence: function() {
    return true;
  },

  acknowledge_subscription: function(data) {
    this._super(data);
    for (var i = 0; i < data.members.length; i++) {
      var member = data.members[i];
      this._members[member.connection_id] = member.data;
    }
  },

  on_member_added: function(data) {
    this._members[data.connection_id] = data.data;
    this._trigger('public', 'socky:member:added', data.data);
  },

  on_member_removed: function(data) {
    var member = this._members[data.connection_id];
    delete this._members[data.connection_id];
    this._trigger('public', 'socky:member:removed', member);
  },

  generate_subscription_payload: function() {
    var payload = this._super();
    if (this._permissions.hide === true) {
      payload.hide = true;
    }
    payload.data = this._subscription_data;
    return payload;
  },

  members: function() {
    return this._members;
  }

});

