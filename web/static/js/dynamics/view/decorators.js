var DynamicsDecorators = {
  stateOptions:  {
      "NOT_STARTED" : "Not Started",
      "STARTED" : "Started",
      "PENDING" : "Pending",
      "BLOCKED" : "Blocked",
      "IMPLEMENTED" : "Ready",
      "DONE" : "Done"
    },
  stateDecorator: function(val) {
    return DynamicsDecorators.stateOptions[val];
  },
  conditionColorDecorator: function(getter,colorcallback,innerDecorator) {
    return function(value) {
      var compar = getter.call(this);
      var color = colorcallback(compar);
      var val = innerDecorator.call(this, value);
      if(color) {
        return '<span style="color: ' + color +';">' + val + '</span>'; 
      } else {
        return val;
      }
    };
  },
  stateColorDecorator: function(state) {
    var text = DynamicsDecorators.stateDecorator(state);
    return '<div class="taskState taskState'+state+'">'+text+'</div>';
  },
  enabledDisabledOptions: {
    "true":  "Enabled",
    "false": "Disabled"
  },
  enabledDisabledColorDecorator: function(state) {
    var text = DynamicsDecorators.enabledDisabledOptions[state];
    var stateClass = {
      "false": "NOT_STARTED",
      "true":  "DONE"
    };
    return '<div class="taskState taskState'+stateClass[state]+'">'+text+'</div>';
  },
  appendDecoratorFactory: function(str) {
    return function(value) {
      return value + str;
    };
  },
  emptyValueWrapper: function(decorator, emptyText) {
    return function(value) {
      var retval = decorator(value);
      if (!retval || !retval.length) {
        return emptyText;
      }
      return retval;
    };
  }, 
  exactEstimateDecorator: function(value) {
    if (typeof (value) === 'string') {
      return value;
    }
    if(!value) {
      return "&mdash;";
    } else if(value === 0) {
      return "0h";
    } else {
      return Math.round(10*value/60)/10+"h";
    }
  },
  exactEstimateEditDecorator: function(value) {
    if (typeof (value) === 'string') {
      return value;
    }
    if (!value) {
      return "";
    }
    return Math.round(10*value/60)/10+"h";
  },
  exactEstimateSumDecorator: function(value) {
    return DynamicsDecorators.exactEstimateDecorator(value);
  },
  estimateDecorator: function(value) {
    if (!value) {
      return "&mdash;";
    }
    return value;
  },
  dateTimeDecorator: function(value) {
    if(!value) {
      return "";
    }
    var date = new Date();
    date.setTime(value);
    return date.asString();
  },
  timeDecorator: function(value) {
    if(!value) {
      return "";
    }
    var date = new Date();
    date.setTime(value);
    return date.asString().substring(10,16);
  },
  hiddenDecorator: function(value) {
    return '';
  },
  backlogNameLinkDecorator: function(value) {
    if (value) {
      return '<a href="editBacklog.action?backlogId=' + value + '">' + value + '</a>';
    }
    return "";
  },
  plainContextDecorator: function(value) {
    if (! value || (! value.backlogId && ! value.storyId)) {
      return "(not set)";
    }
    return value.name;
  },
  storyContextDecorator: function(value) {
    return '<a class="context" title="Backlog: ' + value.getName() + '" href="editBacklog.action?backlogId=' + value.getId() + '">' + value.getName() + '</a>';
  },
  taskContextDecorator: function(value) {
    var returned = "";
    
    if (value.backlog) {
      returned += '<a class="context" title="Backlog: ' + value.backlog.getName() + '" href="editBacklog.action?backlogId=' + value.backlog.getId() + '">' + value.backlog.getName() + '</a>';
    }
    if (value.story) {
      returned += '<br/><span title="Story: ' + value.story.getName() + '" class="context context-story">' + value.story.getName() + '</a>';
    }
    
    if(value.task) {
      returned += '<br/><span title="Task: ' + value.task.getName() + '" class="context context-task">' + value.task.getName() + '</a>';
    }
    
    return returned;
  },
  tasksWithoutStoryContextDecorator: function(value) {
    return DynamicsDecorators.taskContextDecorator({backlog: value, story: null});
  },
  backlogSelectDecorator: function(backlog) {
    if (!backlog) {
      return "(no backlog selected)";
    }
    return backlog.getName();
  },
  dateDecorator: function(value) {
    if(!value) {
      return "";
    }
    var date = new Date();
    date.setTime(value);
    return date.asString().substr(0, 10);
  },
  userNameDecorator: function(user) {
    return user.getFullName();
  },
  assigneesDecorator: function(userList) {
    return DynamicsDecorators.userInitialsListDecorator(userList, "No assignees selected");
  },
  userInitialsListDecorator: function(userList, emptyText) {
    if(!userList || !userList.length) {
      if (!emptyText) {
        return "";
      } else {
        return emptyText;
      }
    }
    var initials = [];
    for(var i = 0; i < userList.length; i++) {
      initials.push(userList[i].getInitials());
    }
    return initials.join(", ");
  },
  teamUserCountDecorator: function(userList) {
    return userList.length + " members";
  },
  teamUserListDecorator: function(userList) {
    if (!userList || !userList.length) {
      return "(no users)";
    }
    var fullNames = [];
    for (var i = 0; i < userList.length; i++) {
      fullNames.push(userList[i].getFullName());
    }
    fullNames.sort();
    return fullNames.join(', ');
  },
  teamUserInitialsListDecorator: function(userList) {
    if(!userList || !userList.length) {
      return "(Select users)";
    }
    var initials = [];
    for(var i = 0; i < userList.length; i++) {
      initials.push(userList[i].getInitials());
    }
    return initials.join(", ");
  },
  teamListDecorator: function(teamList) {
    if (!teamList || !teamList.length) {
      return "(No teams)";
    }
    var names = [];
    for (var i = 0; i < teamList.length; i++) {
      names.push(teamList[i].getName());
    }
    names.sort(function(a,b) {
      return (a.toLowerCase() > b.toLowerCase());
    });
    return names.join(", ");
  },
  annotatedUserInitialsListDecorator: function(annotatedList) {
      if(!annotatedList || !annotatedList.length) {
          return "";
      }
      var initials = [];
      $.each(annotatedList, function (k, v) {
          var i = v.user.getInitials();
          if (v.workingOnTask) {
              i = '<strong>' + i + '</strong>';
          }
          initials.push(i);
      });
      return initials.join(", ");
  },
  totalPersonalLoadDecorator: function(value) {
    var baseline = this.getBacklog().getBaselineLoad();
    var strBaseline = DynamicsDecorators.exactEstimateDecorator(baseline);
    var strValue = DynamicsDecorators.exactEstimateDecorator(value);
    var strTotal = DynamicsDecorators.exactEstimateDecorator(value + baseline);
    return strBaseline + " + " + strValue + " = " + strTotal;
  },
  projectStates: {
    "GREEN": "Green",
    "YELLOW": "Yellow",
    "RED": "Red",
    "GREY": "Grey",
    "BLACK": "Black"
  },
  projectStatusToImg: {
    "GREEN": "static/img/status-green.png",
    "YELLOW": "static/img/status-yellow.png",
    "RED": "static/img/status-red.png",
    "BLACK": "static/img/status-black.png",
    "GREY": "static/img/status-grey.png"
  },
  projectStatusDecorator: function(val) {
    var src = DynamicsDecorators.projectStatusToImg[val];
    var img = "<img src=\"" + src +"\" alt=\"Status\"/>";
    return img;
  },
  empty: function() {
    return "";
  },
  idLinkDecoratorFactory: function(target) {
    return function(value) {
      return '<a href="' + target.replace("#id", this.getId()) + '">' + value + '<a/>';
    };
  },
  onEmptyDecoratorFactory: function(text) {
    return function(value) {
      if(!value) {
        return text;
      } else {
        return value;
      }
    };
  },
  emptyDescriptionDecorator: function(value) {
    var f = DynamicsDecorators.onEmptyDecoratorFactory('<span style="color: #666; font-size: 80%;">(Empty description)</span>');
    return f(value);
  },
  propertyDecoratorFactory: function(propertyFunction) {
    return function(context) {
      if (context != null) {
        return propertyFunction.call(context);
      }
      return "";
    };
  }
};
