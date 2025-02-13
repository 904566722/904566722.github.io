import{_ as a,c as s,a as e,o as l}from"./app-BDAgxtHV.js";const i={};function d(t,n){return l(),s("div",null,n[0]||(n[0]=[e(`<ul><li><a href="#%E4%B8%80%E6%96%87%E6%A1%A3%E4%BF%A1%E6%81%AF">一、文档信息</a></li><li><a href="#%E4%BA%8C%E8%B0%83%E7%A0%94%E5%86%85%E5%AE%B9">二、调研内容</a><ul><li><a href="#21-%E6%8A%80%E6%9C%AF%E6%A6%82%E8%BF%B0">2.1 技术概述</a></li><li><a href="#22-%E5%85%B3%E9%94%AE%E7%89%B9%E6%80%A7">2.2 关键特性</a><ul><li><a href="#vlan-%E5%AD%90%E6%8E%A5%E5%8F%A3">vlan 子接口</a></li></ul></li></ul></li><li><a href="#%E5%8F%82%E8%80%83%E8%B5%84%E6%96%99">参考资料</a></li></ul><h2 id="一、文档信息" tabindex="-1"><a class="header-anchor" href="#一、文档信息"><span>一、文档信息</span></a></h2><table><thead><tr><th>版本号</th><th>修订内容</th><th>修订原因</th><th>修订日期</th><th>修订人</th></tr></thead><tbody><tr><td>v1.0</td><td>新增</td><td>-</td><td>2025-02-07</td><td>洪惠强</td></tr></tbody></table><p>技术领域：网络、网卡、Linux</p><h2 id="二、调研内容" tabindex="-1"><a class="header-anchor" href="#二、调研内容"><span>二、调研内容</span></a></h2><h3 id="_2-1-技术概述" tabindex="-1"><a class="header-anchor" href="#_2-1-技术概述"><span>2.1 技术概述</span></a></h3><p>子接口类型：</p><ul><li>vlan 子接口</li><li>ip 子接口</li></ul><p>ip 子接口的命名规则：使用 : 连接，如：ifcfg-enp0s3:990</p><p>vlan 子接口的命名规则：使用 . 连接，如 enp0s3.100</p><h3 id="_2-2-关键特性" tabindex="-1"><a class="header-anchor" href="#_2-2-关键特性"><span>2.2 关键特性</span></a></h3><h4 id="vlan-子接口" tabindex="-1"><a class="header-anchor" href="#vlan-子接口"><span>vlan 子接口</span></a></h4><p>使用 nmcli 创建子接口</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">nmcli connection add type vlan con-name vlan10 ifname vlan10 vlan.parent enp0s6 vlan.id 10 ipv4.method disabled ipv6.method disabled</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ul><li>type vlan：指定类型</li><li>con-name：指定连接名称</li><li>ifname：指定接口名称</li><li>vlan.parent：指定父接口，即物理接口</li><li>vlan.id：指定 vlan id</li></ul><p>创建成功之后，会自动生成配置文件：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">[root@host-0001 network-scripts]# cat ifcfg-vlan10</span>
<span class="line">VLAN=yes</span>
<span class="line">TYPE=Vlan</span>
<span class="line">PHYSDEV=enp0s6</span>
<span class="line">VLAN_ID=10</span>
<span class="line">REORDER_HDR=yes</span>
<span class="line">GVRP=no</span>
<span class="line">MVRP=no</span>
<span class="line">HWADDR=</span>
<span class="line">PROXY_METHOD=none</span>
<span class="line">BROWSER_ONLY=no</span>
<span class="line">IPV6_DISABLED=yes</span>
<span class="line">IPV6INIT=no</span>
<span class="line">NAME=vlan10</span>
<span class="line">UUID=622d31eb-b30b-4347-ae9f-3f8e6dcc40fd</span>
<span class="line">DEVICE=vlan10</span>
<span class="line">ONBOOT=yes</span>
<span class="line"></span>
<span class="line">网卡信息：</span>
<span class="line">12: vlan10@enp0s6: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 qdisc noqueue state UP group default qlen 1000</span>
<span class="line">    link/ether 00:1c:42:2a:49:0a brd ff:ff:ff:ff:ff:ff</span>
<span class="line"></span>
<span class="line">连接信息：</span>
<span class="line">[root@host-0001 network-scripts]# nmcli con show</span>
<span class="line">NAME    UUID                                  TYPE      DEVICE</span>
<span class="line">vlan10  622d31eb-b30b-4347-ae9f-3f8e6dcc40fd  vlan      vlan10</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line"># 获取连接类型</span>
<span class="line">nmcli -g connection.type con show vlan10</span>
<span class="line"># 获取父接口</span>
<span class="line">nmcli -g vlan.parent con show vlan10</span>
<span class="line"># 获取 vlan id</span>
<span class="line">nmcli -g vlan.id con show vlan10</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>⚠️ 注意 1. 即使 vlan.parent 指定的父接口不存在，这个子接口还是会创建成功，因此在创建之前，要校验一下父接口是否存在</p><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>`,20)]))}const p=a(i,[["render",d],["__file","wangkazijiekou.html.vue"]]),r=JSON.parse('{"path":"/blogs/gongzuo/2025/wangkazijiekou.html","title":"网卡子接口","lang":"en-US","frontmatter":{"title":"网卡子接口","date":"2025/02/12","tags":["网卡","Linux"],"categories":["工作"]},"headers":[{"level":2,"title":"一、文档信息","slug":"一、文档信息","link":"#一、文档信息","children":[]},{"level":2,"title":"二、调研内容","slug":"二、调研内容","link":"#二、调研内容","children":[{"level":3,"title":"2.1 技术概述","slug":"_2-1-技术概述","link":"#_2-1-技术概述","children":[]},{"level":3,"title":"2.2 关键特性","slug":"_2-2-关键特性","link":"#_2-2-关键特性","children":[]}]},{"level":2,"title":"参考资料","slug":"参考资料","link":"#参考资料","children":[]}],"git":{"createdTime":1739339671000,"updatedTime":1739425323000,"contributors":[{"name":"洪惠强","email":"904566722@qq.com","commits":1}]},"filePathRelative":"blogs/工作/2025/网卡子接口.md"}');export{p as comp,r as data};
