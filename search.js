/*
 * @Author: wzheng(hb_wangzheng@163.com)
 * @Github: https://github.com/wayley
 * @Company: Fih-ACKN
 * @Date: 2019-09-12 09:39:50
 * @LastEditors: wzheng(hb_wangzheng@163.com)
 * @LastEditTime: 2019-09-12 16:11:24
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
    return `<input class="form-control" id="search-target-${this.v}" style="margin-left: 15px;" autocomplete="off">
    <div class="search-contain"><span class="input-group-prepend btn-searchApp" id="search-btn-${this.v}" style="cursor: pointer;">
      <span class="input-group-text" style="padding-top:0.6rem;padding-bottom:0.6rem;"><i class="fa fa-search"></i></span>
    </span></div>`;
  };
  Input.prototype.bindHandle = function() {
    var _this = this;
    var v = this.v;
    $(`#search-btn-${v}`).on('click', function() {
      var val = $(`#search-target-${v}`).val();
      _this.callback(val);
    });
  };
  /* -------------------List--------------------- */
  function List(
    el,
    v,
    originData,
    data,
    hasRole,
    appTypeList,
    type,
    editFn,
    delFn
  ) {
    this.el = el;
    this.v = v;
    this.originData = originData;
    this.data = data;
    this.hasRole = hasRole;
    this.appTypeList = appTypeList;
    this.type = type;
    this.editFn = editFn;
    this.delFn = delFn;
  }
  List.prototype.init = function() {
    var data = this.originData;
    this.change(data);
  };
  List.prototype.getItemStr = function(item) {
    var type = this.type;
    var appType = this.appTypeList[parseInt(item[type])]['Name'];
    var action = this.hasRole
      ? `<a href="javascript:void(0);" id="EditRowV${this.v}${item.ID}" idx="${item.index}" rowid="${item.ID}" edit="App">編輯</a><span>/</span><a data-target="#DeleteModal" data-toggle="modal" href="javascript:void(0);" delete="App" rowid="${item.ID}" idx="${item.index}" apptypename="${appType}" id="DelRowV${this.v}${item.ID}">刪除</a>`
      : '';
    function getAppImgSrc(item) {
      var reg = /Remote\:/i;
      return item['ACIconPath'] != null
        ? item['ACIconPath'].replace(reg, '')
        : '';
    }
    return `
      <div class="card">
        <a id="ContentPNo${item.ACPriority}"></a>
        <div class="card-header d-flex justify-content-between align-items-center"><span class="col-10 d-flex align-items-left">${
          item.ACName
        }</span>${action}</div>
        <div class="card-body">
          <div class="row d-flex justify-content-between align-items-center">
            <div class="col-2">
              <img alt="..." class="img-thumbnail" src="${getAppImgSrc(item)}">
            </div>
            <div class="col-10">
              <div class="mb-2">內容類型：<span>${appType}</span></div>
              <div class="mb-2">權重：<span>${item.ACPriority}</span></div>
              <div>包名：<span>${item.ACPackageName}</span></div>
            </div>
          </div>
        </div>
      </div>
    `;
  };
  List.prototype.getItemStr_ = function(item, index) {
    var type = this.type;
    var appType = this.appTypeList[parseInt(item[type])]['Name'];
    var action = this.hasRole
      ? `<a href="javascript:void(0);" id="EditRowV${this.v}${item.ID}" idx="${index}" rowid="${item.ID}" edit="App">編輯</a><span>/</span><a data-target="#DeleteModal" data-toggle="modal" href="javascript:void(0);" delete="App" rowid="${item.ID}" idx="${index}" apptypename="${appType}" id="DelRowV${this.v}${item.ID}">刪除</a>`
      : '';
    function getAppImgSrc(item) {
      var reg = /Remote\:/i;
      return item['IconPath'] != null ? item['IconPath'].replace(reg, '') : '';
    }
    return `
      <div class="card">
        <a id="ContentPNo${item.Priority}"></a>
        <div class="card-header d-flex justify-content-between align-items-center"><span class="col-10 d-flex align-items-left">${
          item.Name
        }</span>${action}</div>
        <div class="card-body">
          <div class="row d-flex justify-content-between align-items-center">
            <div class="col-2">
              <img alt="..." class="img-thumbnail" src="${getAppImgSrc(item)}">
            </div>
            <div class="col-10">
              <div class="mb-2">內容類型：<span>${appType}</span></div>
              <div class="mb-2">權重：<span>${item.Priority}</span></div>
              <div>包名：<span>${item.PackageName}</span></div>
            </div>
          </div>
        </div>
      </div>
    `;
  };
  List.prototype.change = function(data) {
    if (!data || data.length < 0) {
      return;
    }
    var _this = this;
    var parent = $(_this.el);
    var isAc = this.type == 'ACAppType';
    parent.html('');
    $.each(data, function(index, item) {
      console.log(data, '-------33333-');
      var str = isAc ? _this.getItemStr(item) : _this.getItemStr_(item, index);
      if (index == 0) {
        parent.html(str);
      } else {
        parent.append(str);
      }
      _this.bindHandle(item.ID);
    });
  };
  List.prototype.bindHandle = function(id) {
    var _this = this;
    $(`#EditRowV${this.v}${id}`).on('click', function() {
      _this.editFn(id);
    });
    $(`#DelRowV${this.v}${id}`).on('click', function() {
      _this.delFn(id);
    });
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
    var type = this.options.type;
    var _this = this;

    var list = new List(
      listEl,
      v,
      listData,
      listData,
      hasRole,
      appTypeList,
      type,
      function(id) {
        _this.options.editFn && _this.options.editFn(id);
      },
      function(id) {
        _this.options.delFn && _this.options.delFn(id);
      }
    );
    list.init();
    var input = new Input(searchEl, v, function(keyword) {
      _this.change(keyword, list);
    });
    input.init();
  };
  Search.prototype.change = function(keyword, list) {
    var name = this.options.type == 'ACAppType' ? 'ACName' : 'Name';

    var data = list.originData.filter(function(item) {
      return item[name].indexOf(keyword) > -1;
    });
    console.log(keyword, '-----', data, '=========', list.originData);

    list.change(data);
  };
  Search.prototype.show = function() {};

  // 暴露出去
  $.Search = $.fn.Search = (function(Search) {
    return Search;
  })(Search);
})(jQuery);
