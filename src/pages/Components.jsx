import Button from "../components/Button";
import Badge from "../components/Badge";
import Avatar from "../components/Avatar";
import TotalRevenueCard from "../components/TotalRevenueCard";
import OrderStatistics from "../components/OrderStatistics";
import PercentageCard from "../components/PercentageCard";
import ActivityTimeline from "../components/ActivityTimeline";
import OrdersTable from "../components/OrdersTable";
import TransactionTable from "../components/TransactionTable";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Components() {
  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
        <div>
          <h1 className="text-sm font-bold text-slate-800 tracking-tight">BUIQ Components Playground</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Semua komponen UI terdokumentasi di sini</p>
        </div>
        <div className="flex gap-2">
          <Button type="primary">
            <i className="ti ti-plus text-xs" /> Tambah
          </Button>
          <Button type="success">
            <i className="ti ti-download text-xs" /> Export
          </Button>
        </div>
      </div>

      {/* Basic Components */}
      <Section label="Basic components">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button type="primary"><i className="ti ti-device-floppy text-xs" /> Simpan</Button>
            <Button type="success"><i className="ti ti-check text-xs" /> Success</Button>
            <Button type="danger"><i className="ti ti-x text-xs" /> Danger</Button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge type="success"><i className="ti ti-circle-check text-xs" /> Aktif</Badge>
            <Badge type="warning"><i className="ti ti-clock text-xs" /> Pending</Badge>
            <Badge type="danger"><i className="ti ti-circle-x text-xs" /> Ditolak</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Avatar name="Budi" color="blue" />
            <Avatar name="Siti" color="purple" />
            <Avatar name="Andi" color="green" />
            <div className="ml-1">
              <p className="text-sm font-medium text-gray-900">3 pengguna aktif</p>
              <p className="text-xs text-gray-400">Budi, Siti, Andi</p>
            </div>
          </div>
        </div>
      </Section>

      {/* CRM Cards */}
      <Section label="CRM cards">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TotalRevenueCard />
          <OrderStatistics />
          <PercentageCard />
        </div>
      </Section>

      {/* Timeline */}
      <Section label="Activity timeline">
        <ActivityTimeline />
      </Section>

      {/* Tables */}
      <Section label="Orders table">
        <OrdersTable />
      </Section>

      <Section label="Transaction table">
        <TransactionTable />
      </Section>

      {/* Shadcn UI Components */}
      <Section label="Shadcn UI Components">

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <Tabs defaultValue="dashboard">
            <TabsList>
              <TabsTrigger value="dashboard">
                Dashboard
              </TabsTrigger>

              <TabsTrigger value="report">
                Report
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <p className="mt-3 text-sm">
                Dashboard CRM sedang aktif.
              </p>
            </TabsContent>

            <TabsContent value="report">
              <p className="mt-3 text-sm">
                Data laporan penjualan.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 mt-4 shadow-sm">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                Informasi CRM
              </AccordionTrigger>

              <AccordionContent>
                Sistem CRM digunakan untuk mengelola customer dan transaksi.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 mt-4 shadow-sm">
          <Dialog>
            <DialogTrigger asChild>
              <Button type="primary">
                Buka Dialog
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Shadcn UI
                </DialogTitle>
              </DialogHeader>

              <p className="text-xs text-slate-500">
                Implementasi Dialog berhasil ditambahkan ke project CRM.
              </p>

            </DialogContent>
          </Dialog>
        </div>

      </Section>

    </div>
  );
}

function Section({ label, children }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-3">
        {label}
      </p>
      {children}
    </div>
  );
}