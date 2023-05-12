# finalizer 简单实践记录

<!--more-->
#k8s 

> [https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/finalizers/](https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/finalizers/)

```go
func (r *VolcanoBackendReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
	l := log.FromContext(ctx)
	l.Info("the vcb reconcile is triggered...")

	vcb := new(operatorv1.VolcanoBackend)
	if err := r.Get(ctx, req.NamespacedName, vcb); err != nil {
		l.Error(err, "unable to fetch VolcanoBackend")

		return ctrl.Result{}, client.IgnoreNotFound(err)
	}

	// 默认 vcb，创建 volcano 相关资源
	if vcb.Name == vc_operator.DftVolcanoBackend && vcb.Namespace == vc_operator.DftVolcanoBackendNS {
		// 默认资源需要有我们的 finalizer，如果没有，需要添加
		if vcb.ObjectMeta.DeletionTimestamp.IsZero() {
			if !controllerutil.ContainsFinalizer(vcb, config.VolcanoResourcesFinalizer) {
				controllerutil.AddFinalizer(vcb, config.VolcanoResourcesFinalizer)
				if err := r.Update(ctx, vcb); err != nil {
					l.Error(err, "failed to update default vcb")
					return ctrl.Result{}, err
				}
				l.Info("default vcb add finalizer success")
			}
		} else {
			// 默认 vcb 正在被删除
			if controllerutil.ContainsFinalizer(vcb, config.VolcanoResourcesFinalizer) {
				err := r.deleteVolcanoResources(ctx)
				if err != nil {
					l.Error(err, "failed to delete volcano resources")
					return ctrl.Result{}, err
				}
				l.Info("clean volcano resources success")

				controllerutil.RemoveFinalizer(vcb, config.VolcanoResourcesFinalizer)
				if err := r.Update(ctx, vcb); err != nil {
					l.Error(err, "failed to update default vcb")
					return ctrl.Result{}, err
				}
				l.Info("remove finalizer from default vcb success")
			}

			return ctrl.Result{}, nil
		}

		err := r.reconcileVolcanoResources(ctx, l)
		if err != nil {
			l.Error(err, "volcano resources reconcile failed")
			return ctrl.Result{}, err
		}

		l.Info("volcano resources reconcile success")
	}

	return ctrl.Result{}, nil
}
```

