---
title: "Arch的Boot优化"
date: 2/9/2026, 10:09:40 PM
pubDate: 2/9/2026, 10:09:40 PM
tags: [""]
categories: 
description: 这是一个没有描述的文章
wordCount: 1207
readingTime: 5
---

---
title: Arch 的 boot 优化
---

## 效果

```bash
cilxry@cilxry-arch ~> systemd-analyze
Startup finished in 6.653s (firmware) + 1.018s (loader) + 629ms (kernel) + 3.752s (initrd) + 6.116s (userspace) = 18.170s
graphical.target reached after 6.116s in userspace.
```

至少说，我觉得 18sec 的启动速度是要比 Windows 好上不少的
注：这个 18 秒是指从按下电源键到进入 DE，有开 AutoLogin

教程：[Arch Wiki](https://aw.lilydjwg.me/wiki/%E9%9D%99%E9%BB%98%E5%90%AF%E5%8A%A8)

## GRUB 的优化

这是 AUR 的 `grub-silent` 包
用 `yay -S grub-silent` 来安装
（编译的过程可能会比较久，稍安勿躁）
要注意 `grub-slient` 和 `grub` 是冲突的，安装完成之后需要重新安装 GRUB

一般来讲， `grub-silent` 会自动修改 `/etc/default/grub`
确认其中的 `GRUB_TIMEOUT` 的值应该是 `0`

ArchWiki 还提到，建议给启动内核加上这些参数（也是改 `/etc/default/grub` 加在 `GRUB_CMDLINE_LINUX_DEFAULT` 里）
`quiet loglevel=3 systemd.show_status=auto rd.udev.log_level=3`

### 重安装 GRUB 教程

`lsblk -f` 查看 EFI 分区，比如，看到分区是 `/dev/nvme0n1p1`
那么接下来挂载它（如果没有）：`sudo mount /dev/nvme0n1p1 /efi`
再之后用这段命令重装：

```bash
sudo grub-install \
    --target=x86_64-efi \
    --efi-directory=/efi \
    --bootloader-id="Arch Linux" \
    --recheck
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

## 添加启动动画

使用 `plymouth` 包

如果不主动添加延迟，那启动动画是不会拖慢速度的，
或者说，不添加延迟的时候，启动动画就是一闪而过然后进入 userspace

[Plymouth](https://wiki.archlinuxcn.org/wiki/Plymouth)

（在文档里的我就不写了哈）
（要是要补充的话，补充安装和更改主题一部分的内容）

## SDDM

[主题](https://github.com/uiriansan/SilentSDDM)

[Wiki](https://wiki.archlinuxcn.org/wiki/SDDM)

