/*
 * @Author: wzheng(hb_wangzheng@163.com)
 * @Github: https://github.com/wayley
 * @Company: Fih-ACKN
 * @Date: 2019-09-11 09:39:50
 * @LastEditors: wzheng(hb_wangzheng@163.com)
 * @LastEditTime: 2019-09-11 18:55:53
 * @Description:
 */
(function($) {
  /* -------------------Input--------------------- */
  function Input(el, v, callback) {
    this.el = el;
    this.v = v;
    this.callback = callback;
  }
  Input.prototype.init = function() {
    $(this.el).html(this.getStr()); // 插入html
    this.bindHandle(); // 绑定事件
  };
  Input.prototype.getStr = function() {
    return `<input type="text" id="search-target-${this.v}"><span class="icon" id="search-icon-${this.v}"></span>`;
  };
  Input.prototype.bindHandle = function() {
    var _this = this;
    var v = this.v;
    $(`#search-icon-${v}`).on('click', function() {
      var val = $(`#search-target-${v}`).val();
      _this.callback(val);
    });
  };
  /* -------------------List--------------------- */
  function List(el, v, originData, data, hasRole, appTypeList) {
    this.el = el;
    this.v = v;
    this.originData = originData;
    this.data = data;
    this.hasRole = hasRole;
    this.appTypeList = appTypeList;
  }

  List.prototype.init = function() {
    var data = this.originData;
    this.change(data);
  };
  List.prototype.getItemStr = function(item) {
    var v = this.v;
    return `
    <div class="card" id="card-${v}">
      <div class="card-header"><span onclick="edit()">编辑</span><i>/</i><span onclick="del()">删除</span></div>
      <div class="card-body">${item.name}</div>
    </div>
    `;
  };
  List.prototype.change = function(data) {
    if (!data || data.length < 0) {
      return;
    }
    var str = '';
    var _this = this;
    $.each(data, function(index, item) {
      str += _this.getItemStr(item);
    });
    $(this.el).html(str);
  };
  /* -------------------Search--------------------- */
  function Search(opts) {
    var defaults = {
      v: 'v' + Math.floor(Math.random() * 10000) + new Date().valueOf(),
      list: []
    };
    try {
      if (typeof opts !== 'object') {
        throw Error('配置项错误');
      }
      if (!opts.searchEl) {
        throw Error('请指定搜索区域元素');
      }
      if (!opts.listEl) {
        throw Error('请指定列表区域元素');
      }
      var options = $.extend({}, defaults, opts);
      this.options = options;
    } catch (error) {
      throw error;
    }
  }
  Search.prototype.init = function() {
    var searchEl = this.options.searchEl;
    var listEl = this.options.listEl;
    var v = this.options.v;
    var listData = this.options.list;
    var hasRole = this.options.hasRole;
    var appTypeList = this.options.appTypeList;

    var list = new List(listEl, v, listData, listData, hasRole, appTypeList);
    list.init();

    var _this = this;
    var input = new Input(searchEl, v, function(keyword) {
      // 搜索框change事件处理
      _this.change(keyword, list);
    });
    input.init();
  };
  Search.prototype.change = function(keyword, list) {
    var data = list.originData.filter(function(item) {
      return item.name.indexOf(keyword) > -1;
    });
    list.change(data);
  };
  Search.prototype.show = function() {};

  // 暴露出去
  $.Search = $.fn.Search = (function(Search) {
    return Search;
  })(Search);
})(jQuery);
