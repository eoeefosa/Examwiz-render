const dashboard = (res) => {
  // return view('admin.dashboard', [
  //     'title' => 'Admin Dashboard',
  //     'vendors' => Vendor::all()->count(),
  //     'users' => User::all()->count(),
  //     'transactions' => Transaction::all()->count(),

  // ]);
  return res.render("auth/forgot-password", { title: "login" });
};

/*======================================================================================================================*/

const allUsers = (res) => {
  // return view('admin.users')->with([
  //     'users' => User::paginate(700)
  // ]);
  res.render("auth/forgot-password", { title: "login" });
};

const updateUserAccountBalance = (req, user) => {
  // $request->validate(['amount' => 'numeric|required']);
  // $user->update(['available_balance' => $request->get('amount')]);
  // return redirect()->route('admin.users')->with('success', 'Account balance of ' . $user->name . ' updated successfully');
};

const updateUserProfit = (req, user) => {
  // $request->validate(['profit' => 'numeric|required']);
  // $user->update(['bitcoin_balance' => $request->get('profit')]);
  // return redirect()->route('admin.users')->with('success', 'profits of ' . $user->name . ' updated successfully');
};

const updateUserPlan = (req, user) => {
  // $request->validate(['plan' => 'string|required']); // Adjusted validation rule to accept a string
  // $user->update(['plan' => $request->get('plan')]); // Updated 'available_balance' to 'plan'
  // return redirect()->route('admin.users')->with('success', 'Plan of ' . $user->name . ' updated successfully');
};

/*======================================================================================================================*/
const transactions = () => {
  // return view('admin.transactions')->with([
  //     'transactions' => Transaction::paginate(1000)
  // ]);
};

const createTransaction = (req) => {
  // $request['tx_id'] = $this->generalService->generateTxid();
  //  $transaction = Transaction::create($request->all());
  //  return redirect()->route('admin.transactions')->with('success', 'Transaction created successfully');
};

const updateTransaction = (req, transaction) => {
  // $transaction->update($request->all());
  // return redirect()->route('admin.transactions')->with('success', 'Transaction updated successfully');
};

const deleteTransaction = (transaction) => {
  // $transaction->delete();
  // return redirect()->route('admin.transactions')->with('success', 'Transaction has been moved to trash successfully.');
};
